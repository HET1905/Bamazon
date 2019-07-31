select department_id,department_name,over_head_costs,sum(product_sales) 
from departments,products 
where departments.department_name= products.dept_name 
group by department_name;
