import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  static async uploadImage(file: File) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.data.user.id}/${fileName}`;

      // Primeiro, faça o upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Depois, pegue a URL pública
      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');

      return { 
        data: {
          url: urlData.publicUrl,
          path: filePath
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { data: null, error };
    }
  }

  static async uploadImages(files: File[]) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      const urls = results
        .filter(result => result.data)
        .map(result => result.data);

      const errors = results
        .filter(result => result.error)
        .map(result => result.error);

      if (errors.length > 0) {
        throw errors[0];
      }

      return { data: urls, error: null };
    } catch (error) {
      console.error('Upload errors:', error);
      return { data: null, error };
    }
  }

  static async deleteImage(path: string) {
    try {
      const { error } = await supabase.storage
        .from('listings')
        .remove([path]);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error) {
      console.error('Delete error:', error);
      return { data: null, error };
    }
  }
}
