/**
 * React Hook for Headscale Integration
 * 
 * Provides easy-to-use React hooks for managing machines and VPN network
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createHeadscaleService, 
  type MachineToken,
} from '@/services/headscale';
import { toast } from 'sonner';

// Configuration - In production, get from environment variables
const HEADSCALE_CONFIG = {
  baseURL: import.meta.env.VITE_HEADSCALE_URL || 'http://localhost:8080',
  apiKey: import.meta.env.VITE_HEADSCALE_API_KEY || '',
};

const headscaleService = createHeadscaleService(HEADSCALE_CONFIG);

/**
 * Hook for listing registered machines
 */
export function useMachines(userId?: string) {
  return useQuery({
    queryKey: ['machines', userId],
    queryFn: () => headscaleService.listMachines(userId),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook for getting a specific machine
 */
export function useMachine(machineId: string) {
  return useQuery({
    queryKey: ['machine', machineId],
    queryFn: () => headscaleService.getMachine(machineId),
    enabled: !!machineId,
  });
}

/**
 * Hook for generating registration tokens
 */
export function useGenerateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ machineName, expiresIn }: { machineName: string; expiresIn?: number }) =>
      headscaleService.generateRegistrationToken(machineName, expiresIn),
    onSuccess: (data) => {
      toast.success('Registration token generated', {
        description: `Token valid for ${data.machineName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['preauthkeys'] });
    },
    onError: (error) => {
      toast.error('Failed to generate token', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Hook for deleting a machine
 */
export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (machineId: string) => headscaleService.deleteMachine(machineId),
    onSuccess: (_, machineId) => {
      toast.success('Machine deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', machineId] });
    },
    onError: () => {
      toast.error('Failed to delete machine');
    },
  });
}

/**
 * Hook for renaming a machine
 */
export function useRenameMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ machineId, newName }: { machineId: string; newName: string }) =>
      headscaleService.renameMachine(machineId, newName),
    onSuccess: (_, { machineId }) => {
      toast.success('Machine renamed successfully');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', machineId] });
    },
    onError: () => {
      toast.error('Failed to rename machine');
    },
  });
}

/**
 * Hook for expiring a machine (force re-authentication)
 */
export function useExpireMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (machineId: string) => headscaleService.expireMachine(machineId),
    onSuccess: (_, machineId) => {
      toast.success('Machine expired - will need to re-authenticate');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', machineId] });
    },
    onError: () => {
      toast.error('Failed to expire machine');
    },
  });
}

/**
 * Hook for listing pre-auth keys
 */
export function usePreAuthKeys() {
  return useQuery({
    queryKey: ['preauthkeys'],
    queryFn: () => headscaleService.listPreAuthKeys(),
  });
}

/**
 * Hook for expiring a pre-auth key
 */
export function useExpirePreAuthKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => headscaleService.expirePreAuthKey(keyId),
    onSuccess: () => {
      toast.success('Pre-auth key expired');
      queryClient.invalidateQueries({ queryKey: ['preauthkeys'] });
    },
    onError: () => {
      toast.error('Failed to expire pre-auth key');
    },
  });
}

/**
 * Hook for listing network routes
 */
export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: () => headscaleService.listRoutes(),
  });
}

/**
 * Hook for enabling/disabling routes
 */
export function useSetRouteEnabled() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, enabled }: { routeId: string; enabled: boolean }) =>
      headscaleService.setRouteEnabled(routeId, enabled),
    onSuccess: (_, { enabled }) => {
      toast.success(`Route ${enabled ? 'enabled' : 'disabled'}`);
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: () => {
      toast.error('Failed to update route');
    },
  });
}

/**
 * Hook for managing machine tags
 */
export function useMachineTags(machineId: string) {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load tags
  useEffect(() => {
    if (machineId) {
      setLoading(true);
      headscaleService.getMachineTags(machineId)
        .then(setTags)
        .finally(() => setLoading(false));
    }
  }, [machineId]);

  // Update tags
  const updateTags = useCallback(async (newTags: string[]) => {
    setLoading(true);
    try {
      const success = await headscaleService.setMachineTags(machineId, newTags);
      if (success) {
        setTags(newTags);
        toast.success('Tags updated successfully');
        queryClient.invalidateQueries({ queryKey: ['machine', machineId] });
      } else {
        toast.error('Failed to update tags');
      }
    } finally {
      setLoading(false);
    }
  }, [machineId, queryClient]);

  return { tags, updateTags, loading };
}

/**
 * Custom hook for machine registration workflow
 * Combines token generation and monitoring
 */
export function useMachineRegistration() {
  const [registrationToken, setRegistrationToken] = useState<MachineToken | null>(null);
  const [pollingForMachine, setPollingForMachine] = useState(false);
  const generateToken = useGenerateToken();
  const { refetch: refetchMachines } = useMachines();

  const startRegistration = useCallback(async (machineName: string, expiresIn?: number) => {
    const token = await generateToken.mutateAsync({ machineName, expiresIn });
    setRegistrationToken(token);
    setPollingForMachine(true);
    return token;
  }, [generateToken]);

  // Poll for newly registered machine
  useEffect(() => {
    if (!pollingForMachine || !registrationToken) return;

    const interval = setInterval(async () => {
      const result = await refetchMachines();
      const newMachine = result.data?.find(
        m => m.name === registrationToken.machineName
      );

      if (newMachine) {
        setPollingForMachine(false);
        toast.success('Machine registered successfully!', {
          description: `${newMachine.name} is now connected`,
        });
      }
    }, 5000); // Check every 5 seconds

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      setPollingForMachine(false);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollingForMachine, registrationToken, refetchMachines]);

  const cancelRegistration = useCallback(() => {
    setPollingForMachine(false);
    setRegistrationToken(null);
  }, []);

  return {
    registrationToken,
    pollingForMachine,
    startRegistration,
    cancelRegistration,
    isGenerating: generateToken.isPending,
  };
}

/**
 * Hook for machine statistics
 */
export function useMachineStats() {
  const { data: machines, isLoading } = useMachines();

  const stats = {
    total: machines?.length || 0,
    connected: machines?.filter(m => m.status === 'connected').length || 0,
    disconnected: machines?.filter(m => m.status === 'disconnected').length || 0,
    byOS: machines?.reduce((acc, machine) => {
      acc[machine.os] = (acc[machine.os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  return { stats, isLoading };
}
