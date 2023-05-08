DROP TABLE PLATA_CHIRIE_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE CONTRACT_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE APARTAMENT_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE AGENT_IMOBILIAR CASCADE CONSTRAINTS;
DROP TABLE CHIRIAS CASCADE CONSTRAINTS;
DROP TABLE JUDET_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE LOCALITATE_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE ADRESA_BUCURESTI CASCADE CONSTRAINTS;

-- DROP SEQUENCE BUCURESTI_JUDET_SEQ;
-- DROP SEQUENCE BUCURESTI_LOCALITATE_SEQ;

-- DROP SEQUENCE BUCURESTI_ADRESA_SEQ;
-- DROP SEQUENCE BUCURESTI_APARTAMENT_SEQ;
-- DROP SEQUENCE BUCURESTI_AGENT_IMOBILIAR_SEQ;
-- DROP SEQUENCE BUCURESTI_CHIRIAS_SEQ;
-- DROP SEQUENCE BUCURESTI_CONTRACT_SEQ;
-- DROP SEQUENCE BUCURESTI_PLATA_CHIRIE_SEQ;

 CREATE SEQUENCE BUCURESTI_JUDET_SEQ START WITH 43 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_LOCALITATE_SEQ START WITH 149 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_ADRESA_SEQ START WITH 169 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_APARTAMENT_SEQ START WITH 153 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_AGENT_IMOBILIAR_SEQ START WITH 73 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_CHIRIAS_SEQ START WITH 99 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_CONTRACT_SEQ START WITH 55 INCREMENT BY 2;
 CREATE SEQUENCE BUCURESTI_PLATA_CHIRIE_SEQ START WITH 41 INCREMENT BY 2;

--JUDET_BUCURESTI
create table JUDET_BUCURESTI as
select * from modbd_centralizat.oltp_judet
where nume = 'Bucuresti';

alter table JUDET_BUCURESTI
add constraint JUD_BUC_ID_PK primary key (id_judet);

alter table JUDET_BUCURESTI
  add constraint JUD_BUCURESTI_NUME_NN
  check ("NUME" IS NOT NULL);

--LOCALITATE_BUCURESTI
create table LOCALITATE_BUCURESTI as
select loc.* 
from modbd_centralizat.oltp_localitate loc  
join modbd_centralizat.oltp_judet jud on loc.id_judet = jud.id_judet
where jud.nume = 'Bucuresti';

alter table LOCALITATE_BUCURESTI
add constraint LOC_BUC_ID_PK primary key (id_localitate);

alter table LOCALITATE_BUCURESTI
  add constraint LOC_BUC_JUD_FK foreign key (id_judet)
  references JUDET_BUCURESTI (id_judet);

alter table LOCALITATE_BUCURESTI
  add constraint LOC_BUC_NUME_NN
  check ("NUME" IS NOT NULL);

--ADRESA_BUCURESTI
create table ADRESA_BUCURESTI as 
select adr.* 
from modbd_centralizat.oltp_adresa adr
join modbd_centralizat.oltp_localitate loc on adr.id_localitate = loc.id_localitate
join modbd_centralizat.oltp_judet jud on loc.id_judet = jud.id_judet
where jud.nume = 'Bucuresti';

alter table ADRESA_BUCURESTI
add constraint ADR_BUC_ID_PK primary key (id_adresa);

alter table ADRESA_BUCURESTI
  add constraint ADR_BUC_LOC_FK foreign key (id_localitate)
  references LOCALITATE_BUCURESTI (id_localitate);

alter table ADRESA_BUCURESTI
  add constraint ADR_BUC_STRADA_NN
  check ("STRADA" IS NOT NULL);

--APARTAMENT_BUCURESTI
create table APARTAMENT_BUCURESTI as 
select ap.*
from modbd_centralizat.oltp_apartament ap
join modbd_centralizat.oltp_adresa adr on ap.id_adresa = adr.id_adresa
join modbd_centralizat.oltp_localitate loc on adr.id_localitate = loc.id_localitate
join modbd_centralizat.oltp_judet jud on loc.id_judet = jud.id_judet
where jud.nume = 'Bucuresti';

alter table APARTAMENT_BUCURESTI
  add constraint APARTAMENT_ID_BUC_APARTAMENT_PK primary key (ID_APARTAMENT);

alter table APARTAMENT_BUCURESTI
  add constraint APT_BUC__ADR_FK foreign key (ID_ADRESA)
  references ADRESA_BUCURESTI (ID_ADRESA);

alter table APARTAMENT_BUCURESTI
  add constraint APARTAMENT_BUC_NR_CAMERE_MIN
  check (numar_camere > 0);

alter table APARTAMENT_BUCURESTI
  add constraint APARTAMENT_BUC_SUPRAFATA_MIN
  check (suprafata > 0);

alter table APARTAMENT_BUCURESTI
  add constraint APARTAMENT_BUC_PRET_MIN
  check (pret_inchiriere > 0);

alter table APARTAMENT_BUCURESTI
  add constraint APARTAMENT_BUC_CONFORT_IN
  check (tip_confort in (1, 2, 3));


--agent imobiliar
create table agent_imobiliar as
select id_agent, prenume, nume, email, telefon, data_angajare
from modbd_centralizat.oltp_agent_imobiliar;

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
select * from modbd_centralizat.oltp_chirias;


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
  
--CONTRACT_BUCURESTI
create table CONTRACT_BUCURESTI AS
SELECT ID_CONTRACT, ID_CHIRIAS, con.ID_APARTAMENT, ID_AGENT, DATA_INCEPUT, DATA_FINAL, ZIUA_SCADENTA, con.PRET_INCHIRIERE, VALOARE_ESTIMATA, INCASARI 
FROM modbd_centralizat.oltp_contract con
join modbd_centralizat.oltp_apartament ap on con.id_apartament = ap.id_apartament
join modbd_centralizat.oltp_adresa adr on ap.id_adresa = adr.id_adresa
join modbd_centralizat.oltp_localitate loc on adr.id_localitate = loc.id_localitate
where loc.nume = 'Bucuresti';

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC_AP_PK primary key (ID_CONTRACT);

alter table CONTRACT_BUCURESTI
  add constraint CON_BUC_AP_ID_FK foreign key (ID_APARTAMENT)
  references APARTAMENT_BUCURESTI (ID_APARTAMENT);

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC__CH_ID_FK foreign key (ID_CHIRIAS)
  references CHIRIAS (ID_CHIRIAS);

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC_AG_ID_FK foreign key (ID_AGENT)
  references AGENT_IMOBILIAR (ID_AGENT);
  
alter table CONTRACT_BUCURESTI
  add constraint ZIUA_SCANDETA_CHECK
  check (ziua_scadenta >= 1 and ziua_scadenta <= 31);

--PLATA_CHIRIE_BUCURESTI
create table PLATA_CHIRIE_BUCURESTI as
SELECT ID_PLATA, pc.ID_CONTRACT, LUNA, AN, SUMA, DATA_EFECTUARII, NR_ZILE_INTARZIERE
FROM modbd_centralizat.OLTP_PLATA_CHIRIE pc
join modbd_centralizat.oltp_contract con on pc.id_contract = con.id_contract
join modbd_centralizat.oltp_apartament ap on con.id_apartament = ap.id_apartament
join modbd_centralizat.oltp_adresa adr on ap.id_adresa = adr.id_adresa
join modbd_centralizat.oltp_localitate loc on adr.id_localitate = loc.id_localitate
where loc.nume = 'Bucuresti';


alter table PLATA_CHIRIE_BUCURESTI
  add constraint PLATA_CHIRIE_BUC_CHIRIE_PK primary key (ID_PLATA);

alter table PLATA_CHIRIE_BUCURESTI
  add constraint PLATA_CHIRIE_BUC_CHIRIE_CONTRACT_FK foreign key (ID_CONTRACT)
  references CONTRACT_BUCURESTI (ID_CONTRACT);

alter table PLATA_CHIRIE_BUCURESTI
  add constraint PLATA_CHIRIE_BUC_CHIRIE_AN_MINIM
  check (an > 1970);

alter table PLATA_CHIRIE_BUCURESTI
  add constraint PLATA_CHIRIE_BUC_CHIRIE_VALORI_LUNA
  check (luna >= 1 and luna <= 12);
