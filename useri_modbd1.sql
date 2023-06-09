create user modbd_centralizat identified by parolamodbd;
create user modbd_national identified by parolamodbd;
create user modbd_bucuresti identified by parolamodbd;

grant create session to modbd_centralizat;
grant resource to modbd_centralizat;

grant create session to modbd_national;
grant resource to modbd_national;

grant create session to modbd_bucuresti;
grant resource to modbd_bucuresti;


--am ramas aici
grant CREATE PUBLIC DATABASE LINK to modbd_national;
grant DROP PUBLIC DATABASE LINK to modbd_national;

grant CREATE PUBLIC DATABASE LINK to modbd_bucuresti;
grant DROP PUBLIC DATABASE LINK to modbd_bucuresti;

grant select, insert, update, delete on modbd_bucuresti.PLATA_CHIRIE_BUCURESTI to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.CONTRACT_BUCURESTI to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.APARTAMENT_BUCURESTI to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.AGENT_IMOBILIAR to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.CHIRIAS to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.JUDET_BUCURESTI to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.LOCALITATE_BUCURESTI to modbd_national;
grant select, insert, update, delete on modbd_bucuresti.ADRESA_BUCURESTI to modbd_national;

grant create view to modbd_national;
grant select on modbd_bucuresti.BUCURESTI_CHIRIAS_SEQ to modbd_national; 
grant select on modbd_bucuresti.BUCURESTI_ADRESA_SEQ to modbd_national; 
grant select on modbd_bucuresti.BUCURESTI_APARTAMENT_SEQ to modbd_national; 
grant select on modbd_bucuresti.BUCURESTI_AGENT_IMOBILIAR_SEQ to modbd_national; 
grant select on modbd_bucuresti.BUCURESTI_CONTRACT_SEQ to modbd_national; 
grant select on modbd_bucuresti.BUCURESTI_PLATA_CHIRIE_SEQ to modbd_national;

grant select on modbd_centralizat.OLTP_PLATA_CHIRIE to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_CONTRACT to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_APARTAMENT to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_AGENT_IMOBILIAR to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_CHIRIAS to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_JUDET to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_LOCALITATE to modbd_bucuresti;
grant select on modbd_centralizat.OLTP_ADRESA to modbd_bucuresti;

grant select on modbd_centralizat.OLTP_AGENT_IMOBILIAR to modbd_national;

ALTER USER modbd_centralizat quota unlimited on USERS;
ALTER USER modbd_national quota unlimited on USERS;
ALTER USER modbd_bucuresti quota unlimited on USERS;
