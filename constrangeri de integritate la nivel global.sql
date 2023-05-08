--constrangere unique email angajat Bucuresti
create or replace trigger trigger_email_agent_unique
before insert or update on AGENT_IMOBILIAR
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  AGENT_IMOBILIAR@bd_provincie
  where email = :new.email;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe email
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/

--constrangere unique telefon angajat Bucuresti
create or replace trigger trigger_telefon_agent_unique
before insert or update on AGENT_IMOBILIAR
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  AGENT_IMOBILIAR@bd_provincie
  where telefon = :new.telefon;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe telefon
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/

--constrangere unique email angajat Provincie
create or replace trigger trigger_email_agent_unique
before insert or update on AGENT_IMOBILIAR
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  AGENT_IMOBILIAR@bd_bucuresti
  where email = :new.email;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe email
       incalcata. Fragmentul de pe bd_bucuresti contine aceeasi valaore');
  end if;
end;
/

--constrangere unique telefon angajat Provincie
create or replace trigger trigger_telefon_agent_unique
before insert or update on AGENT_IMOBILIAR
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  AGENT_IMOBILIAR@bd_bucuresti
  where telefon = :new.telefon;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe telefon
       incalcata. Fragmentul de pe bd_bucuresti contine aceeasi valaore');
  end if;
end;
/

--constrangere unique email chirias Bucuresti
create or replace trigger trigger_email_chirias_unique
before insert or update on CHIRIAS
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  CHIRIAS@bd_provincie
  where email = :new.email;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe email
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/

--constrangere unique telefon chirias Bucuresti
create or replace trigger trigger_telefon_chirias_unique
before insert or update on CHIRIAS
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  CHIRIAS@bd_provincie
  where telefon = :new.telefon;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe telefon
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/

  --constrangere unique email chirias Provincie
create or replace trigger trigger_email_chirias_unique
before insert or update on CHIRIAS
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  CHIRIAS@bd_bucuresti
  where email = :new.email;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe email
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/

--constrangere unique telefon chirias Provincie
create or replace trigger trigger_telefon_chirias_unique
before insert or update on CHIRIAS
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  CHIRIAS@bd_bucuresti
  where telefon = :new.telefon;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe telefon
       incalcata. Fragmentul de pe bd_provincie contine aceeasi valaore');
  end if;
end;
/



