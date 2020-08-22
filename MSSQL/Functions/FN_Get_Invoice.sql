-- FUNCTION: public."FN_Get_Invoice"(text, integer, text)

-- DROP FUNCTION public."FN_Get_Invoice"(text, integer, text);

CREATE OR REPLACE FUNCTION public.FN_Get_Invoice(
	"TName" text,
	"PId" integer,
	"Email" text)
    RETURNS text
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$
Declare
TextTemplate text;
Description text;
Units text;
CostPerUnit text;
Amount text;
TaxJar text;
invoiceSubTotal text;
discount text;
totalOrder text;
InvoiceDate text := '' ;
Begin
IF($1!='' and $2>0 and $3!='')then
select "Template" into TextTemplate from public."EmailTemplates" where "TemplateName"=$1;
select "Pay"."Type","Pay"."LinksCount","Pay"."TotalOrder","Pay"."SubTotal","Pay"."Discount","Pay"."TotalOrder","Pay"."SalesTax","Pay"."PaymentDate" into Description,Units,Amount,invoiceSubTotal,discount,totalOrder,TaxJar,InvoiceDate FROM "public"."Payments" AS "Pay"
where "Pay"."PaymentId"=$2;

if (Description is null) then
    	Description:='';
    End if;
    if (Description = 'Search') then
    	Units:='-';
        CostPerUnit:='-';
    else if(Description = 'Link Removal')then
    Units:=Units;
    CostPerUnit:='50';
    end if;
    end if;
    if (Amount is null) then
    	Amount:='';
    End if;
    if (invoiceSubTotal is null) then
    	invoiceSubTotal:='';
    End if;
    if (totalOrder is null) then
    	totalOrder:='';
    End if;
    if (discount is null) then
    	discount:='-';
    End if;
    if (TaxJar is null) then
    	TaxJar:='-';
    End if;
    
TextTemplate :=replace(TextTemplate,'{BillTO}',$3);
TextTemplate :=replace(TextTemplate,'{ServiceDetails}',Description);
TextTemplate :=replace(TextTemplate,'{Units}',Units);
TextTemplate :=replace(TextTemplate,'{CPU}',CostPerUnit);
TextTemplate :=replace(TextTemplate,'{Amt}',Amount);
TextTemplate :=replace(TextTemplate,'{InS}',invoiceSubTotal);
TextTemplate :=replace(TextTemplate,'{Total}',totalOrder);
TextTemplate :=replace(TextTemplate,'{Discount}',discount);
TextTemplate :=replace(TextTemplate,'{Sales Tax}',TaxJar);
TextTemplate :=replace(TextTemplate,'{date}',InvoiceDate::date);
TextTemplate :=replace(TextTemplate,'{PId}',CAST($2 AS text));
--TextTemplate :=replace(TextTemplate,'{yyyy}',date_part('year',TIMESTAMP cast(InvoiceDate as text)));
return TextTemplate;
End IF;
End

$BODY$;

ALTER FUNCTION public."FN_Get_Invoice"(text, integer, text)
    OWNER TO postgres;

