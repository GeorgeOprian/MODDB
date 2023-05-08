DROP TABLE PLATA_CHIRIE_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE CONTRACT_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE APARTAMENT_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE AGENT_IMOBILIAR CASCADE CONSTRAINTS;
DROP TABLE CHIRIAS CASCADE CONSTRAINTS;
DROP TABLE JUDET_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE LOCALITATE_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE ADRESA_PROVINCIE CASCADE CONSTRAINTS;

-- DROP SEQUENCE BUCURESTI_JUDET_SEQ;
-- DROP SEQUENCE BUCURESTI_LOCALITATE_SEQ;

-- DROP SEQUENCE BUCURESTI_ADRESA_SEQ;
-- DROP SEQUENCE BUCURESTI_APARTAMENT_SEQ;
-- DROP SEQUENCE BUCURESTI_AGENT_IMOBILIAR_SEQ;
-- DROP SEQUENCE BUCURESTI_CHIRIAS_SEQ;
-- DROP SEQUENCE BUCURESTI_CONTRACT_SEQ;
-- DROP SEQUENCE BUCURESTI_PLATA_CHIRIE_SEQ;

CREATE SEQUENCE PROVINCIE_JUDET_SEQ START WITH 44 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_LOCALITATE_SEQ START WITH 148 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_ADRESA_SEQ START WITH 168 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_APARTAMENT_SEQ START WITH 152 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_AGENT_IMOBILIAR_SEQ START WITH 72 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_CHIRIAS_SEQ START WITH 98 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_CONTRACT_SEQ START WITH 56 INCREMENT BY 2;
 CREATE SEQUENCE PROVINCIE_PLATA_CHIRIE_SEQ START WITH 42 INCREMENT BY 2;

--JUDET_PROVINCIE
create table JUDET_PROVINCIE as
select * from oltp_judet@BD_CENTRALIZAT
where nume <> 'Bucuresti';

alter table JUDET_PROVINCIE
add constraint JUD_PROV_ID_PK primary key (id_judet);

alter table JUDET_PROVINCIE
  add constraint JUD_PROVINCIE_NUME_NN
  check ("NUME" IS NOT NULL);

--LOCALITATE_PROVINCIE
create table LOCALITATE_PROVINCIE as
select loc.* 
from oltp_localitate@BD_CENTRALIZAT loc  
join oltp_judet@BD_CENTRALIZAT jud on loc.id_judet = jud.id_judet
where jud.nume <> 'Bucuresti';

alter table LOCALITATE_PROVINCIE
add constraint LOC_PROV_ID_PK primary key (id_localitate);

alter table LOCALITATE_PROVINCIE
  add constraint LOC_PROV_JUD_FK foreign key (id_judet)
  references JUDET_PROVINCIE (id_judet);

alter table LOCALITATE_PROVINCIE
  add constraint LOC_PROV_NUME_NN
  check ("NUME" IS NOT NULL);

--ADRESA_PROVINCIE
create table ADRESA_PROVINCIE as 
select adr.* 
from oltp_adresa@BD_CENTRALIZAT adr
join oltp_localitate@BD_CENTRALIZAT loc on adr.id_localitate = loc.id_localitate
join oltp_judet@BD_CENTRALIZAT jud on loc.id_judet = jud.id_judet
where jud.nume <> 'Bucuresti';

alter table ADRESA_PROVINCIE
add constraint ADR_PROV_ID_PK primary key (id_adresa);

alter table ADRESA_PROVINCIE
  add constraint ADR_PROV_LOC_FK foreign key (id_localitate)
  references LOCALITATE_PROVINCIE (id_localitate);

alter table ADRESA_PROVINCIE
  add constraint ADR_PROV_STRADA_NN
  check ("STRADA" IS NOT NULL);

--APARTAMENT_PROVINCIE
create table APARTAMENT_PROVINCIE as 
select ap.*
from oltp_apartament@BD_CENTRALIZAT ap
join oltp_adresa@BD_CENTRALIZAT adr on ap.id_adresa = adr.id_adresa
join oltp_localitate@BD_CENTRALIZAT loc on adr.id_localitate = loc.id_localitate
join oltp_judet@BD_CENTRALIZAT jud on loc.id_judet = jud.id_judet
where jud.nume <> 'Bucuresti';

alter table APARTAMENT_PROVINCIE
  add constraint APARTAMENT_ID_PROV_APARTAMENT_PK primary key (ID_APARTAMENT);

alter table APARTAMENT_PROVINCIE
  add constraint APT_PROV__ADR_FK foreign key (ID_ADRESA)
  references ADRESA_PROVINCIE (ID_ADRESA);

alter table APARTAMENT_PROVINCIE
  add constraint APARTAMENT_PROV_NR_CAMERE_MIN
  check (numar_camere > 0);

alter table APARTAMENT_PROVINCIE
  add constraint APARTAMENT_PROV_SUPRAFATA_MIN
  check (suprafata > 0);

alter table APARTAMENT_PROVINCIE
  add constraint APARTAMENT_PROV_PRET_MIN
  check (pret_inchiriere > 0);

alter table APARTAMENT_PROVINCIE
  add constraint APARTAMENT_PROV_CONFORT_IN
  check (tip_confort in (1, 2, 3));


--agent_imobiliar
create table agent_imobiliar as
select id_agent, prenume, nume, email, telefon, data_angajare
from oltp_agent_imobiliar@BD_CENTRALIZAT;

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_ID_AGENT_IMOBILIAR_PK primary key (ID_AGENT);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_EMAIL_UK unique (EMAIL);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_TELEFON_UK unique (TELEFON);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_DATA_AGENT_IMOBILIAR_NN
  check ("DATA_ANGAJARE" IS NOT NULL);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_EMAIL_NN
  check ("EMAIL" IS NOT NULL);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_TELEFON_NN
  check ("TELEFON" IS NOT NULL);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_NUME_NN
  check ("NUME" IS NOT NULL);



-- CHIRIAS
create table chirias as
select * from oltp_chirias@BD_CENTRALIZAT;

alter table CHIRIAS
  add constraint CHIRIAS_ID_CHIRIAS_PK primary key (ID_CHIRIAS);


alter table CHIRIAS
  add constraint CHR_NUME_NN
  check (NUME IS NOT NULL);

alter table CHIRIAS
  add constraint CHR_PRENUME_NN
  check (PRENUME IS NOT NULL);

alter table CHIRIAS
  add constraint CHR_EMAIL_NN
  check (EMAIL IS NOT NULL);

alter table CHIRIAS
  add constraint CHIRIAS_EMAIL_UK unique (EMAIL);

alter table CHIRIAS
  add constraint CHIRIAS_TELEFON_UK unique (TELEFON);

--CONTRACT_PROVINCIE
create table CONTRACT_PROVINCIE AS
SELECT ID_CONTRACT, ID_CHIRIAS, con.ID_APARTAMENT, ID_AGENT, DATA_INCEPUT, DATA_FINAL, ZIUA_SCADENTA, con.PRET_INCHIRIERE, VALOARE_ESTIMATA, INCASARI 
FROM oltp_contract@BD_CENTRALIZAT con
join oltp_apartament@BD_CENTRALIZAT ap on con.id_apartament = ap.id_apartament
join oltp_adresa@BD_CENTRALIZAT adr on ap.id_adresa = adr.id_adresa
join oltp_localitate@BD_CENTRALIZAT loc on adr.id_localitate = loc.id_localitate
where loc.nume <> 'Bucuresti';

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV_AP_PK primary key (ID_CONTRACT);

alter table CONTRACT_PROVINCIE
  add constraint CON_PROV_AP_ID_FK foreign key (ID_APARTAMENT)
  references APARTAMENT_PROVINCIE (ID_APARTAMENT);

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV__CH_ID_FK foreign key (ID_CHIRIAS)
  references CHIRIAS (ID_CHIRIAS);

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV_AG_ID_FK foreign key (ID_AGENT)
  references AGENT_IMOBILIAR (ID_AGENT);
  
alter table CONTRACT_PROVINCIE
  add constraint ZIUA_SCANDETA_CHECK
  check (ziua_scadenta >= 1 and ziua_scadenta <= 31);


--PLATA_CHIRIE_PROVINCIE
create table PLATA_CHIRIE_PROVINCIE as
SELECT ID_PLATA, pc.ID_CONTRACT, LUNA, AN, SUMA, DATA_EFECTUARII, NR_ZILE_INTARZIERE
FROM OLTP_PLATA_CHIRIE@BD_CENTRALIZAT pc
join oltp_contract@BD_CENTRALIZAT con on pc.id_contract = con.id_contract
join oltp_apartament@BD_CENTRALIZAT ap on con.id_apartament = ap.id_apartament
join oltp_adresa@BD_CENTRALIZAT adr on ap.id_adresa = adr.id_adresa
join oltp_localitate@BD_CENTRALIZAT loc on adr.id_localitate = loc.id_localitate
where loc.nume <> 'Bucuresti';

alter table PLATA_CHIRIE_PROVINCIE
  add constraint PLATA_CHIRIE_PROV_CHIRIE_PK primary key (ID_PLATA);

alter table PLATA_CHIRIE_PROVINCIE
  add constraint PLATA_CHIRIE_PROV_CHIRIE_CONTRACT_FK foreign key (ID_CONTRACT)
  references CONTRACT_PROVINCIE (ID_CONTRACT);

alter table PLATA_CHIRIE_PROVINCIE
  add constraint PLATA_CHIRIE_PROV_CHIRIE_AN_MINIM
  check (an > 1970);

alter table PLATA_CHIRIE_PROVINCIE
  add constraint PLATA_CHIRIE_PROV_CHIRIE_VALORI_LUNA
  check (luna >= 1 and luna <= 12);