const SUPABASE_URL = 'https://gyvaiehurysccffpqkgv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmFpZWh1cnlzY2NmZnBxa2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU0NDEsImV4cCI6MjA5MDg0MTQ0MX0.o1a7IhuhFTicemk200WLzlosuDBQQVAqQACAx_7-WUU';

// Inicialização segura para não quebrar a página se a CDN falhar
let client = null;

try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        const supabaseLib = window.supabase;
        client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);
        // Exportar a instância para um nome exclusivo para evitar conflito com a biblioteca
        window.supabaseClient = client; 
    } else {
        console.warn('[Supabase] Biblioteca não encontrada ou ainda não carregada.');
    }
} catch (err) {
    console.error('[Supabase] Erro na inicialização:', err);
}

window.SupabaseService = {
    // Helper para verificar se a conexão está ativa
    isConnected() { return !!client; },

    // Produtos
    async getProducts() {
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar produtos:', e);
            return [];
        }
    },
    
    async addProduct(product) {
        if (!client) throw new Error("Supabase não conectado");
        const { data, error } = await client.from('products').insert([product]).select();
        if (error) throw error;
        return data[0];
    },

    async updateProduct(id, updates) {
        if (!client) throw new Error("Supabase não conectado");
        const { data, error } = await client.from('products').update(updates).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async deleteProduct(id) {
        if (!client) throw new Error("Supabase não conectado");
        const { error } = await client.from('products').delete().eq('id', id);
        if (error) throw error;
    },

    // Barbeiros
    async getBarbers() {
        if (!client) return [];
        try {
            const { data, error } = await client.from('barbers').select('*');
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar barbeiros:', e);
            return [];
        }
    },

    async createBarber(data) {
        if (!client) throw new Error("Supabase não conectado");
        const { data: b, error } = await client.from('barbers').insert([data]).select();
        if (error) throw error;
        return b[0];
    },

    async deleteBarber(id) {
        if (!client) throw new Error("Supabase não conectado");
        const { error } = await client.from('barbers').delete().eq('id', id);
        if (error) throw error;
    },

    // Clientes
    async getClients() {
        if (!client) return [];
        try {
            const { data, error } = await client.from('clients').select('*').order('name', { ascending: true });
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar clientes:', e);
            return [];
        }
    },

    // Agendamentos
    async getBookings() {
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('bookings')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar agendamentos:', e);
            return [];
        }
    },

    async createBooking(booking) {
        if (!client) throw new Error("Supabase não conectado");
        const { data, error } = await client.from('bookings').insert([booking]).select();
        if (error) throw error;
        return data[0];
    },

    async updateBooking(id, updates) {
        if (!client) throw new Error("Supabase não conectado");
        const { data, error } = await client.from('bookings').update(updates).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async deleteBooking(id) {
        if (!client) throw new Error("Supabase não conectado");
        const { error } = await client.from('bookings').delete().eq('id', id);
        if (error) throw error;
    },

    // Configurações de Agenda
    async getSchedule(barberId) {
        if (!client) return null;
        try {
            const { data, error } = await client
                .from('schedule_settings')
                .select('*')
                .eq('barber_id', barberId)
                .maybeSingle();
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar agenda:', e);
            return null;
        }
    },

    async saveSchedule(barberId, slots) {
        if (!client) throw new Error("Supabase não conectado");
        
        const { data: existing } = await client
            .from('schedule_settings')
            .select('id')
            .eq('barber_id', barberId)
            .maybeSingle();

        if (existing) {
            const { error } = await client
                .from('schedule_settings')
                .update({ weekly_hours: slots, updated_at: new Date() })
                .eq('barber_id', barberId);
            if (error) throw error;
        } else {
            const { error } = await client
                .from('schedule_settings')
                .insert([{ barber_id: barberId, weekly_hours: slots }]);
            if (error) throw error;
        }
    }
};
