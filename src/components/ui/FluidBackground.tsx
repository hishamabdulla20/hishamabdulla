'use client'

import { useEffect, useRef } from 'react'

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
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

    let cancelled = false
    let dispose = () => {}

    void import('three')
      .then((THREE) => {
        if (cancelled) return

        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: false,
            antialias: false,
            depth: false,
            powerPreference: 'low-power',
            stencil: false,
          })
        } catch {
          return
        }

        renderer.outputColorSpace = THREE.SRGBColorSpace

        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        const resolution = new THREE.Vector2(1, 1)
        const currentBase = new THREE.Color()
        const currentAccent = new THREE.Color()
        const currentHighlight = new THREE.Color()
        const targetBase = new THREE.Color()
        const targetAccent = new THREE.Color()
        const targetHighlight = new THREE.Color()
        const uniforms = {
          uTime: { value: 0 },
          uVelocity: { value: 0 },
          uResolution: { value: resolution },
          uBase: { value: currentBase },
          uAccent: { value: currentAccent },
          uHighlight: { value: currentHighlight },
        }
        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader,
          depthTest: false,
          depthWrite: false,
        })
        const plane = new THREE.Mesh(geometry, material)
        scene.add(plane)

        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)')
        let prefersReducedMotion = reducedMotionQuery.matches
        let animationFrame = 0
        let resizeFrame = 0
        let isRunning = false
        let lastFrameTime = performance.now()
        let previousScrollY = window.scrollY
        let smoothedVelocity = 0

        const readThemeColors = () => {
          const styles = getComputedStyle(document.documentElement)
          targetBase.setStyle(styles.getPropertyValue('--color-bg').trim() || '#000000')
          targetAccent.setStyle(styles.getPropertyValue('--color-accent').trim() || '#b89b72')
          targetHighlight.setStyle(
            styles.getPropertyValue('--color-accent-highlight').trim() || '#e1c296',
          )
        }

        const renderStaticFrame = () => {
          currentBase.copy(targetBase)
          currentAccent.copy(targetAccent)
          currentHighlight.copy(targetHighlight)
          uniforms.uVelocity.value = 0
          renderer.render(scene, camera)
        }

        const resize = () => {
          const isMobile = mobileQuery.matches
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5))
          renderer.setSize(window.innerWidth, window.innerHeight, false)
          renderer.getDrawingBufferSize(resolution)
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

          const minimumFrameTime = mobileQuery.matches ? 1000 / 30 : 1000 / 60
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
          const rawVelocity = THREE.MathUtils.clamp(scrollDelta / Math.max(elapsed, 16) * 0.55, -1, 1)
          const velocityDamping = 1 - Math.exp(-deltaTime * 9)
          const colorDamping = 1 - Math.exp(-deltaTime * 5)

          smoothedVelocity += (rawVelocity - smoothedVelocity) * velocityDamping
          currentBase.lerp(targetBase, colorDamping)
          currentAccent.lerp(targetAccent, colorDamping)
          currentHighlight.lerp(targetHighlight, colorDamping)
          uniforms.uTime.value += deltaTime
          uniforms.uVelocity.value = smoothedVelocity
          renderer.render(scene, camera)

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
        currentBase.copy(targetBase)
        currentAccent.copy(targetAccent)
        currentHighlight.copy(targetHighlight)
        resize()
        renderStaticFrame()
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
          geometry.dispose()
          material.dispose()
          renderer.dispose()
        }
      })
      .catch(() => {
        // The existing CSS background remains the graceful fallback.
      })

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return (
    <div className="fluid-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
