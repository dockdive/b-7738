
// Fix TypeScript errors in these specific functions

// Original function with TS error on line 163
export const createBusiness = async (business: BusinessCreate): Promise<Business> => {
  try {
    // Fix: Cast business.status as BusinessStatus to match the type definition
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        ...business,
        status: business.status as BusinessStatus // Type cast to match expected type
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

// Original function with TS error on line 523
export const replyToReview = async (reviewId: string, reply: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ reply: reply }) // Fix: Use explicit property assignment instead of shorthand
      .eq('id', reviewId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};
