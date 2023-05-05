create user modbd_centralizat identified by parolamodbd;
create user modbd_national identified by parolamodbd;
create user modbd_bucuresti identified by parolamodbd;


grant create session to modbd_centralizat;
grant resource to modbd_centralizat;

grant create session to modbd_national;
grant resource to modbd_national;
grant CREATE PUBLIC DATABASE LINK to modbd_national;
grant DROP PUBLIC DATABASE LINK to modbd_national;

grant create session to modbd_bucuresti;
grant resource to modbd_bucuresti;

ALTER USER modbd_centralizat quota unlimited on USERS;
ALTER USER modbd_national quota unlimited on USERS;
ALTER USER modbd_bucuresti quota unlimited on USERS;
