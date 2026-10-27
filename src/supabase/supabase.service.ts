import { Inject, Injectable } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.module';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly client: SupabaseClient,
  ) {}

  getClient(): SupabaseClient {
    return this.client;
  }

  getUrl(): string {
    return this.client.supabaseUrl;
  }

  async healthCheck(): Promise<{ ok: boolean; url: string; message: string }> {
    try {
      const { error } = await this.client.auth.getSession();
      if (error) {
        return {
          ok: false,
          url: this.client.supabaseUrl,
          message: error.message,
        };
      }

      return {
        ok: true,
        url: this.client.supabaseUrl,
        message: 'Supabase backend connection is healthy.',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Supabase error';
      return {
        ok: false,
        url: this.client.supabaseUrl,
        message,
      };
    }
  }
}
