
import React from 'react';

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schema }) => {
  const schemaString = JSON.stringify(schema);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
};

export default SchemaMarkup;
