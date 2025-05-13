
import React from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showBack title="About" />
      
      <main className="flex-1 p-4 max-w-md mx-auto">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Food Fact Finder Plus</h2>
          <p className="mb-4">
            Food Fact Finder Plus is an application that allows you to scan food product barcodes and get 
            detailed nutritional information about them.
          </p>
          <p className="mb-4">
            Our app uses the Open Food Facts database, which is a free, open and collaborative database 
            of food products from around the world.
          </p>
          <p>
            Food Fact Finder Plus is available in multiple languages and provides information about 
            ingredients, allergens, nutritional values, and more.
          </p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Data Source</h2>
          <p className="mb-4">
            All product data is sourced from the <a href="https://world.openfoodfacts.org/" target="_blank" rel="noopener noreferrer" className="text-app-green underline">Open Food Facts</a> database.
          </p>
          <p>
            Open Food Facts is a collaborative database licensed under the Open Database License (ODbL).
            The individual contents of the database are available under Creative Commons Attribution ShareAlike 4.0 International License.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default About;
