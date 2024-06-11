import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NutritionPlanList.css'; // Create this file for custom styles

const NutritionPlanList = () => {
  const [nutritionPlans, setNutritionPlans] = useState([]);

  useEffect(() => {
    const fetchNutritionPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/nutrition-plans');
        setNutritionPlans(response.data);
      } catch (error) {
        console.error('Error fetching nutrition plans:', error);
      }
    };

    fetchNutritionPlans();
  }, []);

  return (
    <div className="nutrition-plan-list">
      <h2>Nutrition Plans</h2>
      <ul>
        {nutritionPlans.map(plan => (
          <li key={plan.plan_id}>
            <Link to={`/nutrition-plan/${plan.plan_id}`}>{plan.plan_name}</Link>
            <p>{plan.plan_description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionPlanList;
