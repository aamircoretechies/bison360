'use client';

import { Fragment } from 'react';
import {
	Toolbar,
	ToolbarActions,
	ToolbarDescription,
	ToolbarHeading,
	ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { NetworkLiveStockProfilesContent } from '@/app/(protected)/livestock/profiles/content';

export default function LiveStockProfilesPage() {
	const { settings } = useSettings();

	return (
		<Fragment>
			{settings?.layout === 'demo1' && (
				<Container>
					<Toolbar>
						<ToolbarHeading>
							<ToolbarPageTitle />
							<ToolbarDescription>
								<div className="flex items-center flex-wrap gap-1.5 font-medium">
									<span className="text-base text-secondary-foreground">Total Headcount:</span>
									<span className="text-base text-ray-800 font-semibold me-2">{12}</span>
									<span className="text-base text-secondary-foreground">Alive</span>
									<span className="text-base text-foreground font-semibold">{9}</span>
								</div>
							</ToolbarDescription>
						</ToolbarHeading>
						<ToolbarActions>
							<Button variant="outline" asChild>
								<a href="/livestock/reports">Reports</a>
							</Button>
							<Button variant="primary" asChild>
								<a href="/livestock/register">New Tag</a>
							</Button>
						</ToolbarActions>
					</Toolbar>
				</Container>
			)}
			<Container>
				<NetworkLiveStockProfilesContent />
			</Container>
		</Fragment>
	);
}
