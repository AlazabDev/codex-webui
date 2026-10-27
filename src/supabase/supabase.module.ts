import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): SupabaseClient => {
        const url = config.get<string>('SUPABASE_URL');
        const anonKey =
          config.get<string>('SUPABASE_SERVICE_ROLE_KEY') ??
          config.get<string>('SUPABASE_ANON_KEY') ??
          config.get<string>('SUPABASE_PUBLISHABLE_KEY');

        if (!url || !anonKey) {
          throw new Error(
            'Supabase is not configured. Set SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or SUPABASE_PUBLISHABLE_KEY.',
          );
        }

        return createClient(url, anonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          global: {
            headers: {
              'X-Client-Info': 'codex-webui-backend',
            },
          },
        });
      },
    },
    SupabaseService,
  ],
  exports: [SupabaseService, SUPABASE_CLIENT],
})
export class SupabaseModule {}
