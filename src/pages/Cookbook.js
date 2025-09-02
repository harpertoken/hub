import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import CookbookSimple from '../components/CookbookSimple';
import EduSuggestRecipe from './recipes/EduSuggestRecipe';
import SoftwareStackRecipe from './recipes/SoftwareStackRecipe';
import CloudStorageRecipe from './recipes/CloudStorageRecipe';
import EduSearchRecipe from './recipes/EduSearchRecipe';
import AILabRecipe from './recipes/AILabRecipe';
import AdvFeaturesRecipe from './recipes/AdvFeaturesRecipe';
import ModalRecipe from './recipes/ModalRecipe';
import AIIntegrationRecipe from './recipes/AIIntegrationRecipe';
import CodeEditorRecipe from './recipes/CodeEditorRecipe';
import AITechRecipe from './recipes/AITechRecipe';
import AIModelOrchRecipe from './recipes/AIModelOrchRecipe';
import GenAIRecipeGen from './recipes/GenAIRecipeGen';

const Cookbook = () => {
  console.log("Rendering Cookbook component");

  // State to track which recipe is currently being viewed
  const [activeRecipe, setActiveRecipe] = useState(null);

  // List of available recipes
  const recipes = [
    {
      id: 'genai-recipe-generation',
      title: 'AI Model Orchestration for Recipes',
      description: 'Model orchestration for dynamic recipe content generation and management',
      difficulty: 'Medium',
      prepTime: '10 minutes',
      component: GenAIRecipeGenerationRecipe
    },
    {
      id: 'ai-model-orchestration',
      title: 'Advanced AI Model Orchestration',
      description: 'Intelligent routing of requests to different AI models based on task requirements',
      difficulty: 'Advanced',
      prepTime: '30 minutes',
      component: AIModelOrchestrationRecipe
    },
    {
      id: 'ai-techniques',
      title: 'AI Integration Techniques',
      description: 'Understanding the machine learning and computer science techniques used throughout Tolerable',
      difficulty: 'Advanced',
      prepTime: '30 minutes',
      component: AITechRecipe
    },
    {
      id: 'advanced-code-editor',
      title: 'Advanced Code Editor',
      description: 'Implementing a feature-rich code editor with auto-completion and data structure visualization',
      difficulty: 'Advanced',
      prepTime: '45 minutes',
      component: CodeEditorRecipe
    },
    {
      id: 'gemini-ai-integration',
      title: 'Gemini AI Integration',
      description: 'Integrating Google\'s Gemini AI models for multimodal content analysis and generation',
      difficulty: 'Advanced',
      prepTime: '40 minutes',
      component: AIIntegrationRecipe
    },
    {
      id: 'ai-lab-persistent-audio',
      title: 'AI Lab with Persistent Audio',
      description: 'Building a comprehensive AI Lab with multimodal analysis and persistent audio playback',
      difficulty: 'Advanced',
      prepTime: '25 minutes',
      component: AILabRecipe
    },
    {
      id: 'reusable-modal-system',
      title: 'Reusable Modal System',
      description: 'Creating a flexible, context-based modal system with glass morphism styling',
      difficulty: 'Medium',
      prepTime: '20 minutes',
      component: ModalRecipe
    },
    {
      id: 'advanced-interactive-features',
      title: 'Advanced Interactive Features',
      description: 'Implementing GitHub analysis, speech recognition, and screen recording features',
      difficulty: 'Advanced',
      prepTime: '30 minutes',
      component: AdvFeaturesRecipe
    },
    {
      id: 'education-suggestions-toggle',
      title: 'Education Suggestions Toggle',
      description: 'Implement a toggle feature for enabling/disabling AI suggestions in the Education page',
      difficulty: 'Easy',
      prepTime: '5 minutes',
      component: EducationSuggestionsRecipe
    },
    {
      id: 'education-search',
      title: 'Multi-Source Education Search',
      description: 'Implementing web and academic paper search for enhanced educational responses',
      difficulty: 'Advanced',
      prepTime: '20 minutes',
      component: EduSearchRecipe
    },
    {
      id: 'modern-web-stack',
      title: 'Modern Web Stack',
      description: 'Understanding our React, Express, and AI-integrated software stack',
      difficulty: 'Medium',
      prepTime: '10 minutes',
      component: SoftwareStackRecipe
    },
    {
      id: 'cloud-storage-integration',
      title: 'Cloud Storage Integration',
      description: 'Implementing cloud storage solutions with Cloudinary and local fallbacks',
      difficulty: 'Medium',
      prepTime: '15 minutes',
      component: CloudStorageRecipe
    },
    // More recipes will be added here later
  ];

  // If a recipe is selected, show its details
  if (activeRecipe) {
    const RecipeComponent = recipes.find(r => r.id === activeRecipe)?.component;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
        <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-8 relative">
          {/* Simple back link */}
          <button
            onClick={() => setActiveRecipe(null)}
            className="flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>

          {/* Render the selected recipe component */}
          {RecipeComponent && <RecipeComponent />}
        </div>
      </div>
    );
  }

  // Otherwise, show the list of recipes
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Simple header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-normal mb-1" style={{color: 'var(--text-primary)'}}>Tolerable Cookbook</h1>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Recipes for AI-powered features</p>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          {/* Simple list of recipes */}
          <div className="space-y-4 mb-8">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setActiveRecipe(recipe.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{recipe.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-3">Prep time: {recipe.prepTime}</span><span>Difficulty: {recipe.difficulty}</span>
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookbook;
