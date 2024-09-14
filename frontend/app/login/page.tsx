import { Metadata } from 'next';

import { UserAuthForm } from './user-auth-form';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Authentication',
	description: 'Authentication forms built using the components.',
};

export default async function AuthenticationPage() {
	const supabase = createClient();
	// if already logged in, redirect to dashboard
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		redirect('/dashboard');
	}
	return (
		<div className="container relative pt-36 sm:pt-0 h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1680026548022-e76f693d0a62?q=80&w=1826&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover" />
				<div className="relative z-20 flex items-center text-lg font-medium">Cardify</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;Cardify is a great tool for creating flashcards. I&rsquo;ve never seen anything like it before.&rdquo;
						</p>
						<footer className="text-sm">- someone in the future</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">Login</h1>
						<p className="text-sm text-muted-foreground">Click the button below to sign in with google.</p>
					</div>
					<UserAuthForm />
				</div>
			</div>
		</div>
	);
}
