"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, RefreshCcw, AlertTriangle, Info, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getCacheStats, 
  clearAllCaches, 
  clearCache, 
  getLocalStorageInfo, 
  clearAudioLocalStorage, 
  formatBytes, 
  detectExcessiveCacheGrowth, 
  getCacheRecommendations,
  type CacheStats
} from '@/lib/cache-manager';

export function CacheMonitor() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [localStorageInfo, setLocalStorageInfo] = useState<ReturnType<typeof getLocalStorageInfo> | null>(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { toast } = useToast();

  const refreshStats = async () => {
    setLoading(true);
    try {
      const [stats, lsInfo] = await Promise.all([
        getCacheStats(),
        Promise.resolve(getLocalStorageInfo())
      ]);
      setCacheStats(stats);
      setLocalStorageInfo(lsInfo);
    } catch (error) {
      console.error('Error refreshing cache stats:', error);
      toast({
        title: "Error",
        description: "Failed to refresh cache statistics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllCaches = async () => {
    setClearing(true);
    try {
      await clearAllCaches();
      clearAudioLocalStorage();
      
      toast({
        title: "Caches Cleared",
        description: "All caches and audio localStorage data have been cleared successfully.",
      });
      
      await refreshStats();
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast({
        title: "Error",
        description: "Failed to clear caches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setClearing(false);
    }
  };

  const handleClearSpecificCache = async (cacheName: string) => {
    try {
      await clearCache(cacheName);
      
      toast({
        title: "Cache Cleared",
        description: `Cache "${cacheName}" has been cleared successfully.`,
      });
      
      await refreshStats();
    } catch (error) {
      console.error(`Error clearing cache ${cacheName}:`, error);
      toast({
        title: "Error",
        description: `Failed to clear cache "${cacheName}".`,
        variant: "destructive"
      });
    }
  };

  const handleClearAudioLocalStorage = () => {
    try {
      clearAudioLocalStorage();
      
      toast({
        title: "Audio Data Cleared",
        description: "All audio-related localStorage data has been cleared.",
      });
      
      setLocalStorageInfo(getLocalStorageInfo());
    } catch (error) {
      console.error('Error clearing audio localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to clear audio localStorage data.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  if (!cacheStats || !localStorageInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Monitor
          </CardTitle>
          <CardDescription>Loading cache statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCcw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isExcessive = detectExcessiveCacheGrowth(cacheStats);
  const recommendations = getCacheRecommendations(cacheStats);
  const totalStorageUsed = cacheStats.totalSize + localStorageInfo.size;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Overview
            {isExcessive && <AlertTriangle className="h-5 w-5 text-destructive" />}
          </CardTitle>
          <CardDescription>
            Current browser storage usage and cache statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Storage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Storage Used</span>
              <span className="text-lg font-bold">
                {formatBytes(totalStorageUsed)}
              </span>
            </div>
            {cacheStats.storageQuota && (
              <div className="space-y-1">
                <Progress 
                  value={(totalStorageUsed / cacheStats.storageQuota) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Used: {formatBytes(totalStorageUsed)}</span>
                  <span>Quota: {formatBytes(cacheStats.storageQuota)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cache vs LocalStorage Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Cache Storage</div>
              <div className="text-lg font-semibold">{cacheStats.formattedSize}</div>
              <div className="text-xs text-muted-foreground">{cacheStats.totalEntries} entries</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">LocalStorage</div>
              <div className="text-lg font-semibold">{localStorageInfo.formattedSize}</div>
              <div className="text-xs text-muted-foreground">{localStorageInfo.entries} entries</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={refreshStats} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleClearAllCaches} 
              disabled={clearing}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Caches
            </Button>
            <Button 
              onClick={handleClearAudioLocalStorage}
              variant="outline"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Audio Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Individual Caches */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Caches</CardTitle>
          <CardDescription>
            Detailed breakdown of each cache
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cacheStats.caches.map((cache) => (
              <div
                key={cache.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{cache.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {cache.entries} entries • {formatBytes(cache.size)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cache.size > 50 * 1024 * 1024 && (
                    <Badge variant="destructive">Large</Badge>
                  )}
                  <Button
                    onClick={() => handleClearSpecificCache(cache.name)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {cacheStats.caches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No caches found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
