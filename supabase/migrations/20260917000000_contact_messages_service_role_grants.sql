-- The server-side contact route and admin inbox use the service role. RLS is
-- still enabled; no privileges are granted to browser-facing roles here.
grant select, insert, update, delete on table public.contact_messages to service_role;
