// Add route handler to bypass Vercel protection for success page
export async function GET() {
  // This endpoint ensures the success page is accessible
  return new Response('Success page accessible', { status: 200 });
}
