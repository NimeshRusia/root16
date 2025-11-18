import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { healthcareOptions } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Stethoscope,
  Clock,
  Star,
  HeartPulse,
  ExternalLink,
  RefreshCcw,
} from 'lucide-react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const haversineDistance = (a: Coordinates, b: Coordinates) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon),
      Math.sqrt(1 - (sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon)),
    );

  return Number((R * c).toFixed(1));
};

export default function CompareHealthcare() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this device.');
      setIsLocating(false);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationError(null);
        setIsLocating(false);
        toast({
          title: 'Location Updated',
          description: 'Showing hospitals closest to you.',
        });
      },
      (error) => {
        setLocationError(error.message || 'Unable to fetch your location.');
        setIsLocating(false);
        toast({
          title: 'Location Error',
          description: 'Please allow location access or try again.',
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hospitals = useMemo(() => {
    return healthcareOptions
      .map((hospital) => {
        if (
          userLocation &&
          typeof hospital.latitude === 'number' &&
          typeof hospital.longitude === 'number'
        ) {
          return {
            ...hospital,
            distanceKm: haversineDistance(userLocation, {
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }),
          };
        }
        return { ...hospital, distanceKm: null };
      })
      .sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Nearby Healthcare</h1>
              <p className="text-sm text-muted-foreground">
                Discover hospitals around your current location
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-10 h-10 text-primary" />
              <div>
                <p className="text-lg font-semibold">Your Location</p>
                <p className="text-sm text-muted-foreground">
                  {isLocating && 'Fetching your location...'}
                  {!isLocating && userLocation && (
                    <>
                      Lat: {userLocation.latitude.toFixed(3)}, Lon: {userLocation.longitude.toFixed(3)}
                    </>
                  )}
                  {!isLocating && !userLocation && locationError && locationError}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={requestLocation} disabled={isLocating}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                {isLocating ? 'Locating...' : 'Retry'}
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: 'Location Permission',
                    description: 'Please allow location in your browser settings.',
                  });
                }}
                variant="ghost"
              >
                Help
              </Button>
            </div>
          </div>

          {locationError && (
            <p className="text-sm text-destructive mt-4">{locationError}. Showing default order.</p>
          )}
        </Card>

        <div className="grid gap-6">
          {hospitals.map((hospital, index) => (
            <Card
              key={hospital.id}
              className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold">{hospital.name}</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">{hospital.platform}</p>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {hospital.openingHours}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hospital.address}
                    </span>
                    {hospital.distanceKm !== null && (
                      <span className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        {hospital.distanceKm} km away
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Consultation</p>
                      <p className="text-xl font-bold text-primary">₹{hospital.consultationFee}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Dressing</p>
                      <p className="text-xl font-bold">₹{hospital.dressingFee}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Medicines</p>
                      <p className="text-xl font-bold">₹{hospital.medicineEstimate}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <p className="text-xl font-bold">{hospital.rating}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hospital.tags?.map((tag) => (
                      <Badge key={tag} className="bg-primary/10 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-64 space-y-3">
                  <Card className="p-4 bg-muted/40 border-dashed border-border h-full">
                    <p className="text-sm font-semibold mb-2">Quick Info</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Open: {hospital.openingHours}
                      </li>
                      <li className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {hospital.address.split(',')[0]}
                      </li>
                    </ul>
                  </Card>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="lg"
                      onClick={() => {
                        if (hospital.mapsUrl) {
                          window.open(hospital.mapsUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/dashboard')}
                      className="w-full"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3">🩺 Health Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Keep emergency contacts saved in your phone.</li>
            <li>• Carry basic medical history or prescriptions when visiting a hospital.</li>
            <li>• Call ahead to check doctor availability during peak hours.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

