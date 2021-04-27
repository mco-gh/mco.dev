+++
description = ""
tags = ["data"]
title = "Datasette"
+++ 

* <a href="https://mco.dev/datasette">mco.dev/datasette</a>
* <a href="https://datasette.io" target="_blank">datasette home page</a>
* <a href="https://calmcode.io/datasette/introduction.html" target="_blank">video tutorial</a>
* <a href="https://antonz.org/sqlite-is-not-a-toy-database/" target="_blank">SQLite is not a toy database</a> - *"SQLite is the most common DBMS in the world"*
* <a href="https://www.kaggle.com/datasnaek/chess" target="_blank">data source</a>
* **install**: `pip install csvs-to-sqlite datasette datasette-vega`
* **convert**: `csvs-to-sqlite games.csv games.db`
* **start**: `datasette games.db`
* **simple query**: `SELECT winner, COUNT(*) FROM games GROUP BY winner`
* **complex query**:
```sql
select winner, count(*) from games group by winner
select rating, victory_status, a, b, cast(a as float)/cast(b as float)*100 from (select
    case 
        when white_rating between 0 and 1200 then '0-1200' 
        when white_rating between 1200 and 1500 then '1200-1500'
        when white_rating between 1500 and 1800 then '1500-1800' 
        when white_rating between 1800 and 2100 then '1800-2100' 
        when white_rating between 2100 and 2400 then '2100-2400' 
        else '2400+'
    end as rating, victory_status, count(*) as a,
    sum(count(victory_status)) over (partition by case 
        when white_rating between 0 and 1200 then '0-1200' 
        when white_rating between 1200 and 1500 then '1200-1500'
        when white_rating between 1500 and 1800 then '1500-1800' 
        when white_rating between 1800 and 2100 then '1800-2100' 
        when white_rating between 2100 and 2400 then '2100-2400' 
        else '2400+'
    end) as b
from games
group by rating, victory_status)
```
* **publish**: `datasette publish cloudrun`
  * Cloud Run support is only <a href="https://github.com/simonw/datasette/blob/main/datasette/publish/cloudrun.py" target="_blank">182 lines of Python</a>!
* **ideas**:
  * <a href="https://github.com/googlecodelabs/tools/tree/master/claat" target="_blank">codelabs</a>
  * <a href="gohugo.io" target="_blank">hugo</a>
  * <a href="https://tiddlywiki.com/" target="_blank">tiddlywiki</a>
  * <a href="https://wordpress.org/" target="_blank">wordpress</a>
* **plug**: <a href="https://codelabs-preview.appspot.com/?file_id=1s0voEW-Fb8q_U3Al6AnLB1C52gkZjZRu_Rd69KtnuPQ#0" target="_blank">my Cloud Run workshop for Google I/O</a>
