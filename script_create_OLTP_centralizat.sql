DROP TABLE OLTP_PLATA_CHIRIE CASCADE CONSTRAINTS;
DROP TABLE OLTP_CONTRACT CASCADE CONSTRAINTS;
DROP TABLE OLTP_APARTAMENT CASCADE CONSTRAINTS;
DROP TABLE OLTP_AGENT_IMOBILIAR CASCADE CONSTRAINTS;
DROP TABLE OLTP_CHIRIAS CASCADE CONSTRAINTS;
DROP TABLE OLTP_JUDET CASCADE CONSTRAINTS;
DROP TABLE OLTP_LOCALITATE CASCADE CONSTRAINTS;
DROP TABLE OLTP_ADRESA CASCADE CONSTRAINTS;

DROP SEQUENCE OLTP_ADRESA_SEQ;
DROP SEQUENCE OLTP_LOCALITATE_SEQ;
DROP SEQUENCE OLTP_JUDET_SEQ;
DROP SEQUENCE OLTP_AGENT_IMOBILIAR_SEQ;
DROP SEQUENCE OLTP_CHIRIAS_SEQ;
DROP SEQUENCE OLTP_APARTAMENT_SEQ;
DROP SEQUENCE OLTP_CONTRACT_SEQ;
DROP SEQUENCE OLTP_PLATA_CHIRIE_SEQ;

CREATE SEQUENCE OLTP_ADRESA_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_LOCALITATE_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_JUDET_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_AGENT_IMOBILIAR_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_CHIRIAS_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_APARTAMENT_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_CONTRACT_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE OLTP_PLATA_CHIRIE_SEQ START WITH 1 INCREMENT BY 1;


create table OLTP_JUDET
(
  id_judet          NUMBER(4) DEFAULT OLTP_JUDET_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25)
)
;

alter table OLTP_JUDET
add constraint OLTP_JUD_ID_PK primary key (id_judet);

create index OLTP_JUD_NUME_IX on OLTP_JUDET (nume);

alter table OLTP_JUDET
  add constraint OLTP_JUD_NUME_NN
  check ("NUME" IS NOT NULL);

create table OLTP_LOCALITATE
(
  id_localitate     NUMBER(4) DEFAULT OLTP_LOCALITATE_SEQ.NEXTVAL not null,
  nume              VARCHAR2(25),
  id_judet          NUMBER(4) not null
)
;

alter table OLTP_LOCALITATE
add constraint OLTP_LOC_ID_PK primary key (id_localitate);

alter table OLTP_LOCALITATE
  add constraint OLTP_LOC_OLTP_JUD_FK foreign key (id_judet)
  references OLTP_JUDET (id_judet);

create index OLTP_LOC_NUME_IX on OLTP_LOCALITATE (nume);

alter table OLTP_LOCALITATE
  add constraint OLTP_LOC_NUME_NN
  check ("NUME" IS NOT NULL);

create table OLTP_ADRESA
(
  id_adresa         NUMBER(4) DEFAULT OLTP_ADRESA_SEQ.NEXTVAL not null,
  strada            VARCHAR2(40),
  numar             NUMBER(4),
  bloc              VARCHAR2(10),
  scara             VARCHAR2(5),
  numar_apartament  NUMBER(4),
  id_localitate     NUMBER(4) not null
)
;

alter table OLTP_ADRESA
add constraint OLTP_ADR_ID_PK primary key (id_adresa);

alter table OLTP_ADRESA
  add constraint OLTP_ADR_OLTP_LOC_FK foreign key (id_localitate)
  references OLTP_LOCALITATE (id_localitate);

create index OLTP_ADR_STRADA_IX on OLTP_ADRESA (strada);

alter table OLTP_ADRESA
  add constraint OLTP_ADR_STRADA_NN
  check ("STRADA" IS NOT NULL);

alter table OLTP_ADRESA
  add constraint OLTP_ADR_UNIQUE UNIQUE (STRADA, NUMAR, BLOC, SCARA, NUMAR_APARTAMENT);


create table OLTP_AGENT_IMOBILIAR
(
  id_agent     NUMBER(6) DEFAULT OLTP_AGENT_IMOBILIAR_SEQ.NEXTVAL not null,
  prenume        VARCHAR2(20),
  nume           VARCHAR2(25),
  email          VARCHAR2(25),
  telefon        VARCHAR2(20),
  data_angajare  DATE,
  salariu        NUMBER(8,2),
  comision       NUMBER(2,2)
)
;

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_ID_OLTP_AGENT_IMOBILIAR_PK primary key (ID_AGENT);

create index OLTP_AGENT_IMOBILIAR_NUME_IX on OLTP_AGENT_IMOBILIAR (NUME, PRENUME);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_EMAIL_UK unique (EMAIL);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_TELEFON_UK unique (TELEFON);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_DATA_OLTP_AGENT_IMOBILIAR_NN
  check ("DATA_ANGAJARE" IS NOT NULL);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_EMAIL_NN
  check ("EMAIL" IS NOT NULL);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_TELEFON_NN
  check ("TELEFON" IS NOT NULL);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_NUME_NN
  check ("NUME" IS NOT NULL);

alter table OLTP_AGENT_IMOBILIAR
  add constraint OLTP_AGENT_IMOBILIAR_SALARIU_MIN
  check (SALARIU > 0);

create table OLTP_CHIRIAS
(
  id_chirias     NUMBER(6) DEFAULT OLTP_CHIRIAS_SEQ.NEXTVAL not null,
  prenume        VARCHAR2(20),
  nume           VARCHAR2(20),
  telefon        VARCHAR2(20),
  email          VARCHAR2(30),
  sex            VARCHAR2(1),
  data_nastere   DATE,
  starea_civila  VARCHAR2(20)
)
;

alter table OLTP_CHIRIAS
  add constraint OLTP_CHIRIAS_ID_OLTP_CHIRIAS_PK primary key (ID_CHIRIAS);

create index OLTP_CHIRIAS_NUME_IX on OLTP_CHIRIAS (NUME, PRENUME);

alter table OLTP_CHIRIAS
  add constraint OLTP_CHR_NUME_NN
  check (NUME IS NOT NULL);

alter table OLTP_CHIRIAS
  add constraint OLTP_CHR_PRENUME_NN
  check (PRENUME IS NOT NULL);

alter table OLTP_CHIRIAS
  add constraint OLTP_CHR_EMAIL_NN
  check (EMAIL IS NOT NULL);

alter table OLTP_CHIRIAS
  add constraint OLTP_CHIRIAS_EMAIL_UK unique (EMAIL);

alter table OLTP_CHIRIAS
  add constraint OLTP_CHIRIAS_TELEFON_UK unique (TELEFON);
  
create table OLTP_APARTAMENT
(
 id_apartament    NUMBER(4) DEFAULT OLTP_APARTAMENT_SEQ.NEXTVAL not null,
 id_adresa        NUMBER(4) not null unique,
 numar_camere     NUMBER(4),
 etaj             CHAR(1) not null,
 suprafata        NUMBER(4),
 centrala_proprie CHAR(1) not null,
 pret_inchiriere  NUMBER(8, 2),
 tip_confort      NUMBER(4) -- confort 1, 2, 3
);

alter table OLTP_APARTAMENT
  add constraint OLTP_APARTAMENT_ID_OLTP_APARTAMENT_PK primary key (ID_APARTAMENT);

alter table OLTP_APARTAMENT
  add constraint OLTP_APT_OLTP_ADR_FK foreign key (ID_ADRESA)
  references OLTP_ADRESA (ID_ADRESA);

alter table OLTP_APARTAMENT
  add constraint OLTP_APARTAMENT_NR_CAMERE_MIN
  check (numar_camere > 0);

alter table OLTP_APARTAMENT
  add constraint OLTP_APARTAMENT_SUPRAFATA_MIN
  check (suprafata > 0);

alter table OLTP_APARTAMENT
  add constraint OLTP_APARTAMENT_PRET_MIN
  check (pret_inchiriere > 0);

alter table OLTP_APARTAMENT
  add constraint OLTP_APARTAMENT_CONFORT_IN
  check (tip_confort in (1, 2, 3));

alter table OLTP_ADRESA add constraint OLTP_ADRESA__UK unique (STRADA, NUMAR, BLOC, SCARA, NUMAR_APARTAMENT, ID_LOCALITATE);

create table OLTP_CONTRACT
(
  id_contract         NUMBER(4) DEFAULT OLTP_CONTRACT_SEQ.NEXTVAL not null,
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

alter table OLTP_CONTRACT
  add constraint OLTP_CONTRACT_AP_PK primary key (ID_CONTRACT);

alter table OLTP_CONTRACT
  add constraint OLTP_CON_AP_ID_FK foreign key (ID_APARTAMENT)
  references OLTP_APARTAMENT (ID_APARTAMENT);

alter table OLTP_CONTRACT
  add constraint OLTP_CON_CH_ID_FK foreign key (ID_CHIRIAS)
  references OLTP_CHIRIAS (ID_CHIRIAS);

alter table OLTP_CONTRACT
  add constraint OLTP_CON_AG_ID_FK foreign key (ID_AGENT)
  references OLTP_AGENT_IMOBILIAR (ID_AGENT);
  
alter table OLTP_CONTRACT
  add constraint ZIUA_SCANDETA_CHECK
  check (ziua_scadenta >= 1 and ziua_scadenta <= 31);

create table OLTP_PLATA_CHIRIE
(
  id_plata         		NUMBER(4) DEFAULT OLTP_PLATA_CHIRIE_SEQ.NEXTVAL not null,
  id_contract      		NUMBER(4) not null,
  luna             		NUMBER(4),
  an               		NUMBER(4),
  suma             		NUMBER(8, 2) default 0,
  data_efectuarii  		DATE not null,
  nr_zile_intarziere 	NUMBER(2)
);

alter table OLTP_PLATA_CHIRIE
  add constraint OLTP_PLATA_CHIRIE_PK primary key (ID_PLATA);

alter table OLTP_PLATA_CHIRIE
  add constraint OLTP_PLATA_CHIRIE_CONTRACT_FK foreign key (ID_CONTRACT)
  references OLTP_CONTRACT (ID_CONTRACT);

alter table OLTP_PLATA_CHIRIE
  add constraint OLTP_PLATA_CHIRIE_AN_MINIM
  check (an > 1970);

alter table OLTP_PLATA_CHIRIE
  add constraint OLTP_PLATA_CHIRIE_VALORI_LUNA
  check (luna >= 1 and luna <= 12);

