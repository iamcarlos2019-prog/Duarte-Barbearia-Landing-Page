const SUPABASE_URL = 'https://gyvaiehurysccffpqkgv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1bQSZQUuOsoe5aKfBeM5DA_UidCJaPa';

// Inicialização segura para não quebrar a página se a CDN falhar
let client = null;

try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        const supabaseLib = window.supabase;
        client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);
        // Exportar a instância para uso global
        window.supabase = client; 
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
            const { data, error } = await client.from('barbers').select('*').eq('active', true);
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('[Supabase] Erro ao buscar barbeiros:', e);
            return [];
        }
    },

    async addBarber(name) {
        if (!client) throw new Error("Supabase não conectado");
        const { data, error } = await client.from('barbers').insert([{ name }]).select();
        if (error) throw error;
        return data[0];
    },

    // Agendamentos
    async getBookings() {
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('bookings')
                .select('*')
                .order('booking_date', { ascending: true })
                .order('booking_time', { ascending: true });
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
    }
};
