import React from 'react';

export interface HistoryItem {
  _id: string;
  prompt?: string;
  diagram: string;
  diagram_img?: string;
  updateType: 'chat' | 'code' | 'reversion';
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  diagramType: string;
  createdAt: string;
  history: HistoryItem[];
  currentDiagram: string;
}

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      <p className="mb-2">
        <strong>Type:</strong> {project.diagramType}
      </p>
      <p className="mb-2">
        <strong>Created on:</strong> {new Date(project.createdAt).toLocaleDateString()}
      </p>
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Diagram</h2>
        <div dangerouslySetInnerHTML={{ __html: project.currentDiagram }} />
      </div>
      {project.history.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">History</h3>
          <ul className="list-disc pl-4">
            {project.history.map(item => (
              <li key={item._id} className="mt-1">
                {item.diagram}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 