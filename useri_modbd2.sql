create user modbd_provincie identified by parolamodbd;

grant create session to modbd_provincie;
grant resource to modbd_provincie;

ALTER USER modbd_provincie quota unlimited on USERS;