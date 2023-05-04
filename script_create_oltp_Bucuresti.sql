DROP TABLE PLATA_CHIRIE_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE CONTRACT_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE APARTAMENT_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE AGENT_IMOBILIAR_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE CHIRIAS CASCADE CONSTRAINTS;
DROP TABLE JUDET_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE LOCALITATE_BUCURESTI CASCADE CONSTRAINTS;
DROP TABLE ADRESA_BUCURESTI CASCADE CONSTRAINTS;

DROP SEQUENCE BUCURESTI_ADRESA_SEQ;
DROP SEQUENCE BUCURESTI_LOCALITATE_SEQ;
DROP SEQUENCE BUCURESTI_JUDET_SEQ;
DROP SEQUENCE BUCURESTI_APARTAMENT_SEQ;
DROP SEQUENCE BUCURESTI_AGENT_IMOBILIAR_SEQ;
DROP SEQUENCE BUCURESTI_CHIRIAS_SEQ;
DROP SEQUENCE BUCURESTI_CONTRACT_SEQ;
DROP SEQUENCE BUCURESTI_PLATA_CHIRIE_SEQ;

CREATE SEQUENCE BUCURESTI_ADRESA_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_LOCALITATE_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_JUDET_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_APARTAMENT_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_AGENT_IMOBILIAR_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_CHIRIAS_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_CONTRACT_SEQ START WITH 1 INCREMENT BY 2;
CREATE SEQUENCE BUCURESTI_PLATA_CHIRIE_SEQ START WITH 1 INCREMENT BY 2;


create table JUDET_BUCURESTI
(
  id_judet          NUMBER(4) DEFAULT BUCURESTI_ADRESA_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25)
)
;

alter table JUDET_BUCURESTI
add constraint JUD_BUC_ID_PK primary key (id_judet);

alter table JUDET_BUCURESTI
  add constraint JUD_BUCURESTI_NUME_NN
  check ("NUME" IS NOT NULL);

create table LOCALITATE_BUCURESTI
(
  id_localitate     NUMBER(4) DEFAULT BUCURESTI_LOCALITATE_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25),
  id_judet          NUMBER(4) not null
)
;

alter table LOCALITATE_BUCURESTI
add constraint LOC_BUC_ID_PK primary key (id_localitate);

alter table LOCALITATE_BUCURESTI
  add constraint LOC_BUC_JUD_FK foreign key (id_judet)
  references JUDET_BUCURESTI (id_judet);

alter table LOCALITATE_BUCURESTI
  add constraint LOC_BUC_NUME_NN
  check ("NUME" IS NOT NULL);

create table ADRESA_BUCURESTI
(
  id_adresa         NUMBER(4) DEFAULT BUCURESTI_ADRESA_SEQ.NEXTVAL not null,
  strada            VARCHAR2(40),
  numar             NUMBER(4),
  bloc              VARCHAR2(10),
  scara             VARCHAR2(5),
  numar_apartament  NUMBER(4),
  id_localitate     NUMBER(4) not null
)
;

alter table ADRESA_BUCURESTI
add constraint ADR_BUC_ID_PK primary key (id_adresa);

alter table ADRESA_BUCURESTI
  add constraint ADR_BUC_LOC_FK foreign key (id_localitate)
  references LOCALITATE_BUCURESTI (id_localitate);

alter table ADRESA_BUCURESTI
  add constraint ADR_BUC_STRADA_NN
  check ("STRADA" IS NOT NULL);


create table AGENT_IMOBILIAR_BUCURESTI
(
  id_agent       NUMBER(6) DEFAULT BUCURESTI_AGENT_IMOBILIAR_SEQ.NEXTVAL not null,
  prenume        VARCHAR2(20),
  nume           VARCHAR2(25),
  email          VARCHAR2(25),
  telefon        VARCHAR2(20),
  data_angajare  DATE
)
;

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_ID_AGENT_IMOBILIAR_PK primary key (ID_AGENT);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_EMAIL_UK unique (EMAIL);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_TELEFON_UK unique (TELEFON);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_DATA_AGENT_IMOBILIAR_NN
  check ("DATA_ANGAJARE" IS NOT NULL);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_EMAIL_NN
  check ("EMAIL" IS NOT NULL);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_TELEFON_NN
  check ("TELEFON" IS NOT NULL);

alter table AGENT_IMOBILIAR_BUCURESTI
  add constraint AGENT_IMOBILIAR_BUC_NUME_NN
  check ("NUME" IS NOT NULL);


create table CHIRIAS
(
  id_chirias     NUMBER(6) DEFAULT BUCURESTI_CHIRIAS_SEQ.NEXTVAL not null,
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

create table APARTAMENT_BUCURESTI
(
  id_apartament    NUMBER(4) DEFAULT BUCURESTI_APARTAMENT_SEQ.NEXTVAL not null,
  id_adresa        NUMBER(4) not null unique,
  numar_camere     NUMBER(4),
  etaj             CHAR(1) not null,
  suprafata        NUMBER(4),
  centrala_proprie CHAR(1) not null,
  pret_inchiriere  NUMBER(8, 2),
  tip_confort      NUMBER(4) -- confort 1, 2, 3
);

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

create table CONTRACT_BUCURESTI
(
  id_contract         NUMBER(4) DEFAULT BUCURESTI_CONTRACT_SEQ.NEXTVAL not null,
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

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC_AP_PK primary key (ID_CONTRACT);

alter table CONTRACT_BUCURESTI
  add constraint CON_BUC_AP_ID_FK foreign key (ID_APARTAMENT)
  references APARTAMENT_BUCURESTI (ID_APARTAMENT);

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC__CH_ID_FK foreign key (ID_CHIRIAS)
  references CHIRIAS (ID_CHIRIAS);

alter table CONTRACT_BUCURESTI
  add constraint CONTRACT_BUC__AG_ID_FK foreign key (ID_AGENT)
  references AGENT_IMOBILIAR_BUCURESTI (ID_AGENT);
  
alter table CONTRACT_BUCURESTI
  add constraint ZIUA_SCANDETA_CHECK
  check (ziua_scadenta >= 1 and ziua_scadenta <= 31);

create table PLATA_CHIRIE_BUCURESTI
(
  id_plata         		NUMBER(4) DEFAULT BUCURESTI_PLATA_CHIRIE_SEQ.NEXTVAL not null,
  id_contract      		NUMBER(4) not null,
  luna             		NUMBER(4),
  an               		NUMBER(4),
  suma             		NUMBER(8, 2) default 0,
  data_efectuarii  		DATE not null,
  nr_zile_intarziere 	NUMBER(2)
);

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
