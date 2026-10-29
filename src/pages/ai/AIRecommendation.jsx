import React from 'react';
import AIRecommendationAssistant from '../../components/ai/AIRecommendationAssistant';
import styles from './AIRecommendation.module.css';

const AIRecommendation = () => {
  return (
    <div className={styles.pageContainer}>
      <AIRecommendationAssistant />
    </div>
  );
};

export default AIRecommendation;
