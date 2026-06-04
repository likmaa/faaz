import React from 'react';
import Card from './Card';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <Card>
      <Card.Image src={project.image || project.photo} alt={project.titre || project.name} />
      <Card.Body>
        <Card.Title>{project.titre || project.name || 'Projet sans titre'}</Card.Title>
        <Card.Text lines={3}>{project.description || 'Aucune description disponible.'}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="flex items-center justify-between">
          {project.montant_cible && (
            <div className="text-sm">
              <span className="font-semibold text-primary-600">{project.montant_cible} FCFA</span>
              <span className="text-gray-500"> / objectif</span>
            </div>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir plus →
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
}
