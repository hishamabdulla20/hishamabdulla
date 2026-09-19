'use client'

import { useEffect, useRef } from 'react'

const vertexShader = /* glsl */ `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uVelocity;
  uniform vec2 uResolution;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uHighlight;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    vec2 curve = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(random(cell), random(cell + vec2(1.0, 0.0)), curve.x),
      mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0)), curve.x),
      curve.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);

    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = rotation * point * 2.03 + 7.13;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 point = uv * 2.0 - 1.0;
    point.x *= uResolution.x / max(uResolution.y, 1.0);

    float energy = abs(uVelocity);
    float time = uTime * 0.055;
    vec2 drift = vec2(time * 0.24 + uVelocity * 0.09, -time * 0.16);
    float broadFlow = fbm(point * 0.72 + drift);
    vec2 warp = vec2(broadFlow * 0.42, -broadFlow * 0.34);
    float fineFlow = fbm(point * 1.36 + warp + vec2(-time * 0.14, time * 0.10));
    float ribbon = smoothstep(0.35, 0.82, broadFlow * 0.66 + fineFlow * 0.48);
    float wave = 0.5 + 0.5 * sin((point.y + broadFlow * 0.32) * 3.0 - time * 1.15);
    float accentAmount = ribbon * (0.045 + energy * 0.05);
    float highlightAmount = wave * fineFlow * (0.018 + energy * 0.025);

    vec3 color = mix(uBase, uAccent, accentAmount);
    color = mix(color, uHighlight, highlightAmount);

    float edge = smoothstep(1.45, 0.25, length(point * vec2(0.72, 0.9)));
    color = mix(uBase, color, 0.62 + edge * 0.38);

    gl_FragColor = vec4(color, 1.0);
  }
`

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let dispose = () => {}

    const start = () => {
      if (disposed) return

      const gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: 'low-power',
        stencil: false,
      })
      if (!gl) return

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
        gl.deleteShader(shader)
        return null
      }

      const compiledVertexShader = compileShader(gl.VERTEX_SHADER, vertexShader)
      const compiledFragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShader)
      if (!compiledVertexShader || !compiledFragmentShader) return

      const program = gl.createProgram()
      if (!program) return
      gl.attachShader(program, compiledVertexShader)
      gl.attachShader(program, compiledFragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program)
        gl.deleteShader(compiledVertexShader)
        gl.deleteShader(compiledFragmentShader)
        return
      }

      const buffer = gl.createBuffer()
      if (!buffer) return
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      )

      gl.useProgram(program)
      const position = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

      const timeUniform = gl.getUniformLocation(program, 'uTime')
      const velocityUniform = gl.getUniformLocation(program, 'uVelocity')
      const resolutionUniform = gl.getUniformLocation(program, 'uResolution')
      const baseUniform = gl.getUniformLocation(program, 'uBase')
      const accentUniform = gl.getUniformLocation(program, 'uAccent')
      const highlightUniform = gl.getUniformLocation(program, 'uHighlight')

      type Rgb = [number, number, number]
      const parseColor = (value: string, fallback: string): Rgb => {
        const color = /^#([\da-f]{6})$/i.exec(value.trim()) ?? /^#([\da-f]{6})$/i.exec(fallback)
        const hex = color?.[1] ?? '000000'
        return [
          Number.parseInt(hex.slice(0, 2), 16) / 255,
          Number.parseInt(hex.slice(2, 4), 16) / 255,
          Number.parseInt(hex.slice(4, 6), 16) / 255,
        ]
      }
      const copyColor = (target: Rgb, source: Rgb) => {
        target[0] = source[0]
        target[1] = source[1]
        target[2] = source[2]
      }
      const lerpColor = (current: Rgb, target: Rgb, amount: number) => {
        current[0] += (target[0] - current[0]) * amount
        current[1] += (target[1] - current[1]) * amount
        current[2] += (target[2] - current[2]) * amount
      }

      const currentBase: Rgb = [0, 0, 0]
      const currentAccent: Rgb = [0, 0, 0]
      const currentHighlight: Rgb = [0, 0, 0]
      let targetBase: Rgb = [0, 0, 0]
      let targetAccent: Rgb = [0, 0, 0]
      let targetHighlight: Rgb = [0, 0, 0]
      let elapsedTime = 0
      let velocity = 0

      const clamp = (value: number, minimum: number, maximum: number) => (
        Math.max(minimum, Math.min(maximum, value))
      )

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)')
      let prefersReducedMotion = reducedMotionQuery.matches
      let animationFrame = 0
      let resizeFrame = 0
      let isRunning = false
      let lastFrameTime = performance.now()
      let previousScrollY = window.scrollY

      const readThemeColors = () => {
        const styles = getComputedStyle(document.documentElement)
        targetBase = parseColor(styles.getPropertyValue('--color-bg'), '#000000')
        targetAccent = parseColor(styles.getPropertyValue('--color-accent'), '#b89b72')
        targetHighlight = parseColor(
          styles.getPropertyValue('--color-accent-highlight'),
          '#e1c296',
        )
      }

      const render = () => {
        gl.uniform1f(timeUniform, elapsedTime)
        gl.uniform1f(velocityUniform, velocity)
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height)
        gl.uniform3fv(baseUniform, currentBase)
        gl.uniform3fv(accentUniform, currentAccent)
        gl.uniform3fv(highlightUniform, currentHighlight)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }

      const renderStaticFrame = () => {
        copyColor(currentBase, targetBase)
        copyColor(currentAccent, targetAccent)
        copyColor(currentHighlight, targetHighlight)
        velocity = 0
        render()
      }

      const resize = () => {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1 : 1.5)
        canvas.width = Math.max(1, Math.floor(window.innerWidth * pixelRatio))
        canvas.height = Math.max(1, Math.floor(window.innerHeight * pixelRatio))
        gl.viewport(0, 0, canvas.width, canvas.height)
        if (prefersReducedMotion) renderStaticFrame()
      }

      const scheduleResize = () => {
        if (resizeFrame) return
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0
          resize()
        })
      }

      const renderFrame = (now: number) => {
        if (!isRunning) return

        const minimumFrameTime = mobileQuery.matches ? 1000 / 20 : 1000 / 30
        const elapsed = now - lastFrameTime
        if (elapsed < minimumFrameTime) {
          animationFrame = window.requestAnimationFrame(renderFrame)
          return
        }

        const deltaTime = Math.min(elapsed / 1000, 0.05)
        lastFrameTime = now
        const currentScrollY = window.scrollY
        const scrollDelta = currentScrollY - previousScrollY
        previousScrollY = currentScrollY
        const rawVelocity = clamp(scrollDelta / Math.max(elapsed, 16) * 0.55, -1, 1)
        const velocityDamping = 1 - Math.exp(-deltaTime * 9)
        const colorDamping = 1 - Math.exp(-deltaTime * 5)

        velocity += (rawVelocity - velocity) * velocityDamping
        lerpColor(currentBase, targetBase, colorDamping)
        lerpColor(currentAccent, targetAccent, colorDamping)
        lerpColor(currentHighlight, targetHighlight, colorDamping)
        elapsedTime += deltaTime
        render()

        animationFrame = window.requestAnimationFrame(renderFrame)
      }

      const stopAnimation = () => {
        isRunning = false
        window.cancelAnimationFrame(animationFrame)
      }

      const startAnimation = () => {
        if (isRunning || prefersReducedMotion || document.hidden) return
        isRunning = true
        lastFrameTime = performance.now()
        previousScrollY = window.scrollY
        animationFrame = window.requestAnimationFrame(renderFrame)
      }

      const handleMotionPreference = (event: MediaQueryListEvent) => {
        prefersReducedMotion = event.matches
        if (prefersReducedMotion) {
          stopAnimation()
          renderStaticFrame()
        } else {
          startAnimation()
        }
      }

      const handleVisibility = () => {
        if (document.hidden) stopAnimation()
        else if (prefersReducedMotion) renderStaticFrame()
        else startAnimation()
      }

      const themeObserver = new MutationObserver(() => {
        readThemeColors()
        if (prefersReducedMotion) renderStaticFrame()
      })

      readThemeColors()
      renderStaticFrame()
      resize()
      startAnimation()

      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })
      window.addEventListener('resize', scheduleResize, { passive: true })
      document.addEventListener('visibilitychange', handleVisibility)
      reducedMotionQuery.addEventListener('change', handleMotionPreference)
      mobileQuery.addEventListener('change', scheduleResize)

      dispose = () => {
        stopAnimation()
        window.cancelAnimationFrame(resizeFrame)
        themeObserver.disconnect()
        window.removeEventListener('resize', scheduleResize)
        document.removeEventListener('visibilitychange', handleVisibility)
        reducedMotionQuery.removeEventListener('change', handleMotionPreference)
        mobileQuery.removeEventListener('change', scheduleResize)
        gl.deleteBuffer(buffer)
        gl.deleteProgram(program)
        gl.deleteShader(compiledVertexShader)
        gl.deleteShader(compiledFragmentShader)
      }
    }

    const idleId = typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (window as unknown as { requestIdleCallback: (fn: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(start, { timeout: 1200 })
      : setTimeout(start, 100)

    return () => {
      disposed = true
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof idleId === 'number') {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId as unknown as number)
      }
      dispose()
    }
  }, [])

  return (
    <div className="fluid-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
