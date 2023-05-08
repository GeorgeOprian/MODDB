DROP TABLE AGENT_IMOBILIAR;

create table AGENT_IMOBILIAR as
select id_agent, salariu, comision from  modbd_centralizat.oltp_agent_imobiliar;

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_ID_AGENT_IMOBILIAR_NATIONAL_PK primary key (ID_AGENT);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_SALARIU_MIN
  check (SALARIU > 0);

alter table AGENT_IMOBILIAR
  add constraint AGENT_IMOBILIAR_COMISION_MIN
  check (comision >= 0);

  CREATE SEQUENCE NATIONAL_AGENT_IMOBILIAR_SEQ START WITH 72 INCREMENT BY 1;