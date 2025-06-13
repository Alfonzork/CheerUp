import { supabase } from './supabase.service';
import { Nivel } from '../models/supabase.model';
import { Exercises } from '../models/supabase.model';
import { Exercise_media } from '../models/supabase.model';
import { create } from 'ionicons/icons';

export const tutorialService = {
    async getVideos(): Promise<any[]> {
        const { data, error } = await supabase.from('exercise_view').select('*');
        if (error) throw error;
        return data;
    },

    async createVideo(video: { name: string; description: string; url: string; nivel: string }): Promise<any> {
        const { data, error } = await supabase.from('exercise_view').insert(video).select().single();
        if (error) throw error;
        return data;
    },

    async updateVideo(id: number, video: Partial<{ name: string; description: string; url: string; nivel: string }>): Promise<any> {
        const { data, error } = await supabase.from('exercise_view').update(video).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteVideo(id: number): Promise<void> {
        const { error } = await supabase.from('exercise_view').delete().eq('id', id);
        if (error) throw error;
    },

    async loadTutorial(): Promise<Nivel[]> {
        const { data, error } = await supabase.from('difficulty_levels').
            select('id, name, description, exercises:exercises(id, name, description, difficulty_id, exercise_media:exercise_media(id, url, position, media_type, exercise_id))');
        
        if (error) throw error;
        return data;
    },

    async createNivel(nivel: Omit<Nivel, 'id' | 'exercises'>): Promise<Nivel> {
        console.log('Creating nivel:', nivel);
        const { data, error } = await supabase.from('difficulty_levels').insert(
            {name: nivel.name, description: nivel.description}).select().single();
        if (error) throw error;
        return data;
    },

    async updateNivel(id: number, nivel: Partial<Nivel>): Promise<Nivel> {
        const { data, error } = await supabase.from('difficulty_levels').update(nivel).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteNivel(id: number): Promise<void> {
        const { error } = await supabase.from('difficulty_levels').delete().eq('id', id);
        if (error) throw error;
    },

    async createExercise(exercise: Omit<Exercises, 'id' | 'exercise_media'>): Promise<Exercises> {
        const { data, error } = await supabase.from('exercises').insert(
            { name: exercise.name, description: exercise.description, difficulty_id: exercise.difficulty_id }
        ).select().single();
        if (error) throw error;
        return data;
    },

    async updateExercise(id: string, exercise: Partial<{ name: string; description: string; difficulty_id: number }>): Promise<any> {
        const { data, error } = await supabase.from('exercises').update(exercise).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteExercise(id: number): Promise<void> {
        const { error } = await supabase.from('exercises').delete().eq('id', id);
        if (error) throw error;
    }, 
    
    async createExerciseMedia(media: Omit<Exercise_media, 'id'>): Promise<Exercise_media> {
        const { data, error } = await supabase.from('exercise_media').insert(
            {media_type: media.media_type, url: media.url, exercise_id: media.exercise_id, position: media.position}
        ).select().single();
        if (error) throw error;
        return data;
    },

    async updateExerciseMedia(id: string, media: Partial<{ url: string; exercise_id: string; media_type: string }>): Promise<any> {
        const { data, error } = await supabase.from('exercise_media').update(media).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },  

    async deleteExerciseMedia(id: string): Promise<void> {
        const { error } = await supabase.from('exercise_media').delete().eq('id', id);
        if (error) throw error;
    },
};