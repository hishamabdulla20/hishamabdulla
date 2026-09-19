-- Update BroDoctor project technologies, live URL, and GitHub repository URL
update public.projects
set
  technologies = array[]::text[],
  live_url = 'https://www.brodoctor.online',
  github_url = 'https://github.com/hishamabdulla20/brodoctor',
  case_study_url = null
where lower(name) = 'brodoctor';

