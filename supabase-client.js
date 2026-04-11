const SUPABASE_URL = 'https://gyvaiehurysccffpqkgv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1bQSZQUuOsoe5aKfBeM5DA_UidCJaPa';

// Capturar a biblioteca global antes de sobrescrever
const supabaseLib = window.supabase;

// Inicializar a conexão (Instância)
const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportar a instância para uso global para não quebrar scripts legados
window.supabase = client; 

window.SupabaseService = {
    // Produtos
    async getProducts() {
        try {
            const { data, error } = await client
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('[Supabase] Erro ao buscar produtos:', error.message);
                throw error;
            }
            return data;
        } catch (e) {
            console.error('[Supabase] Falha crítica na conexão:', e);
            throw e;
        }
    },
    
    async addProduct(product) {
        const { data, error } = await client
            .from('products')
            .insert([product])
            .select();
        if (error) throw error;
        return data[0];
    },

    async updateProduct(id, updates) {
        const { data, error } = await client
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async deleteProduct(id) {
        const { error } = await client
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Barbeiros
    async getBarbers() {
        const { data, error } = await client
            .from('barbers')
            .select('*')
            .eq('active', true);
        if (error) throw error;
        return data;
    },

    async addBarber(name) {
        const { data, error } = await client
            .from('barbers')
            .insert([{ name }])
            .select();
        if (error) throw error;
        return data[0];
    },

    // Agendamentos
    async getBookings() {
        const { data, error } = await client
            .from('bookings')
            .select('*')
            .order('booking_date', { ascending: true })
            .order('booking_time', { ascending: true });
        if (error) throw error;
        return data;
    },

    async createBooking(booking) {
        const { data, error } = await client
            .from('bookings')
            .insert([booking])
            .select();
        if (error) throw error;
        return data[0];
    }
};
