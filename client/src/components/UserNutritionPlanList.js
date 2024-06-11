import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NutritionPlanList.css'; // Reuse the same CSS

const UserNutritionPlanList = () => {
    // get userId from session storage key 'user' value = {"id":1,"name":"yosef cohen","email":"josef244@gmail.com","role":"user"}
    const userId = JSON.parse(sessionStorage.getItem('user')).id;
    const [nutritionPlans, setNutritionPlans] = useState([]);
    console.log("userId", userId);
    useEffect(() => {
        const fetchNutritionPlans = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}/nutrition-plans`);
                setNutritionPlans(response.data);
            } catch (error) {
                console.error('Error fetching nutrition plans:', error);
            }
        };

        fetchNutritionPlans();
    }, [userId]);

    return (
        <div className="nutrition-plan-list">
            <h2>תפריט תזונה</h2>
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

export default UserNutritionPlanList;
