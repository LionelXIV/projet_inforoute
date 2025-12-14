import { Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { JeuDonnees } from '@/types/data.types';

interface JeuDonneesCardProps {
  jeu: JeuDonnees;
}

export const JeuDonneesCard = ({ jeu }: JeuDonneesCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      wordWrap: 'break-word',
      backgroundColor: '#fff',
      backgroundClip: 'border-box',
      border: '1px solid rgba(0,0,0,0.125)',
      borderRadius: '0.25rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 0.25rem 0.5rem rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div className="card-header" style={{
        padding: '0.5rem 0.75rem',
        marginBottom: '0',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderBottom: '1px solid rgba(0,0,0,0.125)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h6 className="card-title" style={{
            marginBottom: '0',
            fontSize: '0.95rem',
            fontWeight: '600',
            lineHeight: '1.3',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {jeu.titre}
          </h6>
          {jeu.niveau_acces && (
            <span className="badge" style={{
              display: 'inline-block',
              padding: '0.2em 0.5em',
              fontSize: '0.7em',
              fontWeight: '700',
              lineHeight: '1',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              verticalAlign: 'baseline',
              borderRadius: '0.25rem',
              backgroundColor: jeu.niveau_acces === 'Ouvert' ? '#198754' : '#6c757d',
              color: '#fff',
              flexShrink: 0
            }}>
              {jeu.niveau_acces}
            </span>
          )}
        </div>
        {jeu.organisation_nom && (
          <p className="text-muted mb-0 mt-1" style={{
            marginBottom: '0',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: '#6c757d',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {jeu.organisation_nom}
          </p>
        )}
      </div>
      <div className="card-body" style={{ flex: '1 1 auto', padding: '0.75rem' }}>
        <p className="card-text" style={{
          marginBottom: '0.5rem',
          fontSize: '0.8rem',
          color: '#6c757d',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '3.6rem'
        }}>
          {truncateDescription(jeu.description || 'Aucune description disponible', 100)}
        </p>

        {jeu.date_creation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#6c757d', marginTop: '0.5rem' }}>
            <Calendar size={12} />
            <span>{formatDate(jeu.date_creation)}</span>
          </div>
        )}
      </div>
      <div className="card-footer" style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderTop: '1px solid rgba(0,0,0,0.125)',
        borderRadius: '0 0 calc(0.25rem - 1px) calc(0.25rem - 1px)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <Link
          to={`/jeux-donnees/${jeu.id}`}
          className="btn btn-primary"
          style={{
            flex: 1,
            display: 'inline-block',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            verticalAlign: 'middle',
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: '#0d6efd',
            border: '1px solid #0d6efd',
            padding: '0.25rem 0.5rem',
            fontSize: '0.8rem',
            borderRadius: '0.25rem',
            transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0b5ed7';
            e.currentTarget.style.borderColor = '#0a58ca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0d6efd';
            e.currentTarget.style.borderColor = '#0d6efd';
          }}
        >
          Détails
        </Link>
        {jeu.url_originale && (
          <a
            href={jeu.url_originale}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '400',
              lineHeight: '1.5',
              color: '#6c757d',
              textAlign: 'center',
              textDecoration: 'none',
              verticalAlign: 'middle',
              cursor: 'pointer',
              userSelect: 'none',
              backgroundColor: 'transparent',
              border: '1px solid #6c757d',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              borderRadius: '0.25rem',
              width: '36px',
              transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.borderColor = '#6c757d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6c757d';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#6c757d';
            }}
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};
