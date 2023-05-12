--constrangere unique adresa Bucuresti
create or replace trigger trigger_apartament_adr_unique
before insert or update on  ADRESA_BUCURESTI
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  ADRESA_PROVINCIE@bd_provincie
  where STRADA = :NEW.STRADA AND NUMAR = :NEW.NUMAR AND BLOC = :NEW.BLOC AND SCARA = :NEW.SCARA AND NUMAR_APARTAMENT = :NEW.NUMAR_APARTAMENT;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe adresa
       incalcata.');
  end if;
end;
/

--constrangere unique adresa Provincie
create or replace trigger trigger_apartament_adr_unique
before insert or update on  ADRESA_PROVINCIE
for each row
declare
  nr number(1);
begin
  select count(*) into nr
  from  ADRESA_BUCURESTI@bd_bucuresti
  where STRADA = :NEW.STRADA AND NUMAR = :NEW.NUMAR AND BLOC = :NEW.BLOC AND SCARA = :NEW.SCARA AND NUMAR_APARTAMENT = :NEW.NUMAR_APARTAMENT;
  
  if (nr<>0) then
    raise_application_error (-20001,'Constangere de unicitate pe adresa
       incalcata.');
  end if;
end;
/