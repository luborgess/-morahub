import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

export class AuthService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return profile;
  }

  static async signUp(email: string, password: string, userData: Partial<Profile>) {
    try {
      console.log('Iniciando registro do usuário:', { email, userData });

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            image_url: userData.image_url,
          }
        }
      });

      console.log('Resposta do auth.signUp:', { authData, signUpError });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user data returned');

      console.log('Inserindo usuário na tabela users:', {
        id: authData.user.id,
        email: authData.user.email,
        userData
      });

      const { error: profileError, data: profileData } = await supabase
        .from('users')
        .insert({
          ...userData,
          id: authData.user.id,
          email: authData.user.email,
        })
        .select()
        .single();

      console.log('Resposta da inserção na tabela users:', { profileData, profileError });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }

      return this.signIn(email, password);
    } catch (error) {
      console.error('Erro durante o registro:', error);
      throw error;
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static async getCurrentUser() {
    const session = await this.getCurrentSession();
    if (!session) return null;

    console.log('session.user:', session.user);
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    console.log('profile:', profile);
    return profile;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    // Atualizar perfil
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAccount(userId: string) {
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;
  }
}
