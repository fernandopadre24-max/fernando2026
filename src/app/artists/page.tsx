
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ArtistList } from '@/components/artists/artist-list';
import { ArtistForm } from '@/components/artists/artist-form';
import { Artist } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useAuth } from '@/contexts/auth-context';

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        setArtists(loadData('artists', []));
    }
  }, [user]);

  const handleSaveArtist = (artistData: Omit<Artist, 'id'>) => {
    let updatedArtists;
    if (selectedArtist) {
      updatedArtists = artists.map((artist) =>
        artist.id === selectedArtist.id ? { ...selectedArtist, ...artistData } : artist
      );
    } else {
      const newArtist: Artist = {
        ...artistData,
        id: `artist-${Date.now()}`,
      };
      updatedArtists = [...artists, newArtist];
    }
    setArtists(updatedArtists);
    saveData('artists', updatedArtists);
    setIsFormOpen(false);
    setSelectedArtist(null);
  };

  const handleDeleteArtist = (id: string) => {
    const updatedArtists = artists.filter((artist) => artist.id !== id);
    setArtists(updatedArtists);
    saveData('artists', updatedArtists);
  };

  const handleEditArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedArtist(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Artistas</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Artista
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <ArtistList 
            artists={artists} 
            onEdit={handleEditArtist}
            onDelete={handleDeleteArtist}
        />
      </div>

      {isFormOpen && (
        <ArtistForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedArtist(null);
          }}
          onSave={handleSaveArtist}
          artist={selectedArtist}
        />
      )}
    </div>
  );
};

export default ArtistsPage;
