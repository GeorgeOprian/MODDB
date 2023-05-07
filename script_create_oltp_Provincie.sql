DROP TABLE PLATA_CHIRIE_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE CONTRACT_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE APARTAMENT_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE AGENT_IMOBILIAR_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE CHIRIAS CASCADE CONSTRAINTS;
DROP TABLE JUDET_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE LOCALITATE_PROVINCIE CASCADE CONSTRAINTS;
DROP TABLE ADRESA_PROVINCIE CASCADE CONSTRAINTS;

DROP SEQUENCE PROVINCIE_ADRESA_SEQ;
DROP SEQUENCE PROVINCIE_LOCALITATE_SEQ;
DROP SEQUENCE PROVINCIE_JUDET_SEQ;
DROP SEQUENCE PROVINCIE_APARTAMENT_SEQ;
DROP SEQUENCE PROVINCIE_AGENT_IMOBILIAR_SEQ;
DROP SEQUENCE PROVINCIE_CHIRIAS_SEQ;
DROP SEQUENCE PROVINCIE_CONTRACT_SEQ;
DROP SEQUENCE PROVINCIE_PLATA_CHIRIE_SEQ;

CREATE SEQUENCE PROVINCIE_JUDET_SEQ START WITH 1 INCREMENT BY 1 MAXVALUE 41;
CREATE SEQUENCE PROVINCIE_LOCALITATE_SEQ START WITH 148 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_ADRESA_SEQ START WITH 168 INCREMENT BY 2;

CREATE SEQUENCE PROVINCIE_APARTAMENT_SEQ START WITH 2 INCREMENT BY 2;
CREATE SEQUENCE PROVINCIE_AGENT_IMOBILIAR_SEQ START WITH 2 INCREMENT BY 2;
CREATE SEQUENCE PROVINCIE_CHIRIAS_SEQ START WITH 2 INCREMENT BY 2;
CREATE SEQUENCE PROVINCIE_CONTRACT_SEQ START WITH 2 INCREMENT BY 2;
CREATE SEQUENCE PROVINCIE_PLATA_CHIRIE_SEQ START WITH 2 INCREMENT BY 2;


create table JUDET_PROVINCIE
(
  id_judet          NUMBER(4) DEFAULT PROVINCIE_ADRESA_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25)
)
;

alter table JUDET_PROVINCIE
add constraint JUD_PROV_ID_PK primary key (id_judet);

alter table JUDET_PROVINCIE
  add constraint JUD_PROVINCIE_NUME_NN
  check ("NUME" IS NOT NULL);

create table LOCALITATE_PROVINCIE
(
  id_localitate     NUMBER(4) DEFAULT PROVINCIE_LOCALITATE_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25),
  id_judet          NUMBER(4) not null
)
;

alter table LOCALITATE_PROVINCIE
add constraint LOC_PROV_ID_PK primary key (id_localitate);

alter table LOCALITATE_PROVINCIE
  add constraint LOC_PROV_JUD_FK foreign key (id_judet)
  references JUDET_PROVINCIE (id_judet);

alter table LOCALITATE_PROVINCIE
  add constraint LOC_PROV_NUME_NN
  check ("NUME" IS NOT NULL);

create table ADRESA_PROVINCIE
(
  id_adresa         NUMBER(4) DEFAULT PROVINCIE_ADRESA_SEQ.NEXTVAL not null,
  strada            VARCHAR2(40),
  numar             NUMBER(4),
  bloc              VARCHAR2(10),
  scara             VARCHAR2(5),
  numar_apartament  NUMBER(4),
  id_localitate     NUMBER(4) not null
)
;

alter table ADRESA_PROVINCIE
add constraint ADR_PROV_ID_PK primary key (id_adresa);

alter table ADRESA_PROVINCIE
  add constraint ADR_PROV_LOC_FK foreign key (id_localitate)
  references LOCALITATE_PROVINCIE (id_localitate);

alter table ADRESA_PROVINCIE
  add constraint ADR_PROV_STRADA_NN
  check ("STRADA" IS NOT NULL);


create table AGENT_IMOBILIAR_PROVINCIE
(
  id_agent       NUMBER(6) DEFAULT PROVINCIE_AGENT_IMOBILIAR_SEQ.NEXTVAL not null,
  prenume        VARCHAR2(20),
  nume           VARCHAR2(25),
  email          VARCHAR2(25),
  telefon        VARCHAR2(20),
  data_angajare  DATE
)
;

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_ID_AGENT_IMOBILIAR_PK primary key (ID_AGENT);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_EMAIL_UK unique (EMAIL);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_TELEFON_UK unique (TELEFON);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_DATA_AGENT_IMOBILIAR_NN
  check ("DATA_ANGAJARE" IS NOT NULL);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_EMAIL_NN
  check ("EMAIL" IS NOT NULL);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_TELEFON_NN
  check ("TELEFON" IS NOT NULL);

alter table AGENT_IMOBILIAR_PROVINCIE
  add constraint AGENT_IMOBILIAR_PROV_NUME_NN
  check ("NUME" IS NOT NULL);


create table CHIRIAS
(
  id_chirias     NUMBER(6) DEFAULT PROVINCIE_CHIRIAS_SEQ.NEXTVAL not null,
  prenume        VARCHAR2(20),
  nume           VARCHAR2(20),
  telefon        VARCHAR2(20),
  email          VARCHAR2(30),
  sex            VARCHAR2(1),
  data_nastere   DATE,
  starea_civila  VARCHAR2(20)
)
;

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

create table APARTAMENT_PROVINCIE
(
  id_apartament    NUMBER(4) DEFAULT PROVINCIE_APARTAMENT_SEQ.NEXTVAL not null,
  id_adresa        NUMBER(4) not null unique,
  numar_camere     NUMBER(4),
  etaj             CHAR(1) not null,
  suprafata        NUMBER(4),
  centrala_proprie CHAR(1) not null,
  pret_inchiriere  NUMBER(8, 2),
  tip_confort      NUMBER(4) -- confort 1, 2, 3
);

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

create table CONTRACT_PROVINCIE
(
  id_contract         NUMBER(4) DEFAULT PROVINCIE_CONTRACT_SEQ.NEXTVAL not null,
  id_chirias          NUMBER(4) not null,
  id_apartament       NUMBER(4) not null,
  id_agent            NUMBER(4) not null,
  data_inceput        DATE not null,
  data_final          DATE not null,
  ziua_scadenta       NUMBER(4) not null,
  pret_inchiriere     NUMBER(8, 2),
  valoare_estimata    NUMBER(8, 2),
  incasari            NUMBER(8, 2)
);

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV_AP_PK primary key (ID_CONTRACT);

alter table CONTRACT_PROVINCIE
  add constraint CON_PROV_AP_ID_FK foreign key (ID_APARTAMENT)
  references APARTAMENT_PROVINCIE (ID_APARTAMENT);

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV__CH_ID_FK foreign key (ID_CHIRIAS)
  references CHIRIAS (ID_CHIRIAS);

alter table CONTRACT_PROVINCIE
  add constraint CONTRACT_PROV__AG_ID_FK foreign key (ID_AGENT)
  references AGENT_IMOBILIAR_PROVINCIE (ID_AGENT);
  
alter table CONTRACT_PROVINCIE
  add constraint ZIUA_SCANDETA_CHECK
  check (ziua_scadenta >= 1 and ziua_scadenta <= 31);

create table PLATA_CHIRIE_PROVINCIE
(
  id_plata         		NUMBER(4) DEFAULT PROVINCIE_PLATA_CHIRIE_SEQ.NEXTVAL not null,
  id_contract      		NUMBER(4) not null,
  luna             		NUMBER(4),
  an               		NUMBER(4),
  suma             		NUMBER(8, 2) default 0,
  data_efectuarii  		DATE not null,
  nr_zile_intarziere 	NUMBER(2)
);

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
