import { Exercise } from '@/types';

export const kegelExercises: Exercise[] = [
    {
        id: '1',
        name: 'Contração Básica',
        description: 'Contraia os músculos do assoalho pélvico por 3 segundos, depois relaxe por 3 segundos.',
        duration: 10,
        repetitions: 10,
        restTime: 10,
        level: 'beginner',
        category: 'Básico',
    },
    {
        id: '2',
        name: 'Contração Prolongada',
        description: 'Contraia os músculos por 5-10 segundos, mantendo a respiração normal.',
        duration: 15,
        repetitions: 8,
        restTime: 15,
        level: 'intermediate',
        category: 'Intermediário',
    },
    {
        id: '3',
        name: 'Contrações Rápidas',
        description: 'Contrações rápidas de 1 segundo seguidas de relaxamento de 1 segundo.',
        duration: 20,
        repetitions: 15,
        restTime: 10,
        level: 'advanced',
        category: 'Avançado',
    },
    {
        id: '4',
        name: 'Elevator Kegel',
        description: 'Contraia gradualmente, como se estivesse subindo andares de um prédio.',
        duration: 25,
        repetitions: 6,
        restTime: 20,
        level: 'advanced',
        category: 'Avançado',
    },
    {
        id: '5',
        name: 'Contração Lenta',
        description: 'Contraia lentamente e mantenha por 10 segundos antes de relaxar.',
        duration: 12,
        repetitions: 10,
        restTime: 12,
        level: 'intermediate',
        category: 'Intermediário',
    },
];

export const getExercisesByLevel = (level: 'beginner' | 'intermediate' | 'advanced'): Exercise[] => {
    return kegelExercises.filter(exercise => exercise.level === level);
};

export const getExerciseById = (id: string): Exercise | undefined => {
    return kegelExercises.find(exercise => exercise.id === id);
};
