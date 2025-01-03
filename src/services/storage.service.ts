import { supabase } from '../lib/supabase';

export class StorageService {
  static async uploadImage(file: File, path: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Primeiro, faça o upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Depois, crie uma URL pública assinada que expira em 1 hora
      const { data } = await supabase.storage
        .from('listings')
        .createSignedUrl(filePath, 3600);

      if (!data?.signedUrl) throw new Error('Failed to create signed URL');

      return { data: data.signedUrl, error: null };
    } catch (error) {
      console.error('Upload error:', error);
      return { data: null, error };
    }
  }

  static async uploadImages(files: File[], path: string) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, path));
      const results = await Promise.all(uploadPromises);
      
      const urls = results
        .filter(result => result.data)
        .map(result => result.data as string);

      const errors = results
        .filter(result => result.error)
        .map(result => result.error);

      if (errors.length > 0) {
        console.error('Upload errors:', errors);
      }

      return {
        data: urls,
        error: errors.length > 0 ? errors : null,
      };
    } catch (error) {
      console.error('Upload images error:', error);
      return { data: null, error };
    }
  }

  static async deleteImage(url: string) {
    try {
      // Extrair o caminho do arquivo da URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('listings') + 1).join('/');

      if (!filePath) throw new Error('Invalid URL');

      const { error } = await supabase.storage
        .from('listings')
        .remove([filePath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete error:', error);
      return { error };
    }
  }
}
