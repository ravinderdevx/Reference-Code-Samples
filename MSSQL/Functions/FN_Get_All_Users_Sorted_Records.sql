-- FUNCTION: public."FN_Get_All_Users_Sorted_Records"(integer, integer, text, text, text, integer)

-- DROP FUNCTION public."FN_Get_All_Users_Sorted_Records"(integer, integer, text, text, text, integer);

CREATE OR REPLACE FUNCTION public.FN_Get_All_Users_Sorted_Records(
	"PageNo" integer,
	"PageSize" integer,
	"SortColumn" text,
	"SortOrder" text,
	"Email" text,
	"UserId" integer)
    RETURNS json
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$
Declare
 lPageNbr   integer=$1;
 lPageSize  integer=$2;
 lFirstRec  integer= ( $1 - 1 ) * $2;
 lLastRec   integer=( $1 * $2 + 1 );
 jsonData Json; 
Begin
WITH CTE_Results
    AS (
  select ROW_NUMBER() OVER (
      ORDER BY 
        CASE WHEN ($3 = 'Id' AND $4 ='ASC')
                    THEN S."id"
        END ASC,
        CASE WHEN ($3 = 'Id' AND $4='DESC')
                   THEN S."id"
        END DESC,
     CASE WHEN ($3 = 'Email' AND $4 ='ASC')
                    THEN S."email"
        END ASC,
        CASE WHEN ($3 = 'Email' AND $4='DESC')
                   THEN S."email"
       END DESC,
     CASE WHEN ($3 = 'Blocked' AND $4 ='ASC')
                    THEN S."Blocked"
        END ASC,
        CASE WHEN ($3 = 'Blocked' AND $4='DESC')
                   THEN S."Blocked"
       END DESC,
     CASE WHEN ($3 = 'ZipCode' AND $4 ='ASC')
                    THEN S."ZipCode"
        END ASC,
        CASE WHEN ($3 = 'ZipCode' AND $4='DESC')
                   THEN S."ZipCode"
       END DESC,
    CASE WHEN ($3 = 'FirstName' AND $4 ='ASC')
                    THEN S."FirstName"
        END ASC,
        CASE WHEN ($3 = 'FirstName' AND $4='DESC')
                   THEN S."FirstName"
       END DESC,
    CASE WHEN ($3 = 'LastName' AND $4 ='ASC')
                    THEN S."LastName"
        END ASC,
        CASE WHEN ($3 = 'LastName' AND $4='DESC')
                   THEN S."LastName"
       END DESC
     ) as RowNum,
        S."id",
        S."email", 
        S."Blocked",
        S."ZipCode",
      S."FirstName",
      S."LastName"
        from public."system_user" as S
      where ($5 IS NULL OR S."email" LIKE CONCAT('%',$5,'%') )
      AND (CASE WHEN($6 >0)THEN S."id"=$6 WHEN ($6=0)THEN S."id">0 END)
      )
      Select row_to_json(R) into jsonData FROM ( 
    SELECT (select array_to_json(array_agg(t.*)) as resultData
	from (    
    SELECT
      CPC."id",
       CPC."email",
       CPC."Blocked",
       CPC."ZipCode",
      CPC."FirstName",
      CPC."LastName"
    FROM CTE_Results AS CPC
    WHERE
    ROWNUM > lFirstRec 
    AND ROWNUM < lLastRec
    --ORDER BY ROWNUM ASC
    ) t),(SELECT COUNT(*) as totalCount  FROM CTE_Results )) R;
    return jsonData;
    End
   

      
      
      
      
      
      
      
      
      
      
    
    
    
    

$BODY$;

ALTER FUNCTION public."FN_Get_All_Users_Sorted_Records"(integer, integer, text, text, text, integer)
    OWNER TO postgres;

