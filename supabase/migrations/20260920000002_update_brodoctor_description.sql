-- Keep the published BroDoctor card copy in sync with the canonical portfolio content.
update public.projects
set description = 'A digital learning platform built to make medical education simpler, organized, and more accessible.'
where lower(name) = 'brodoctor';
