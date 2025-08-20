'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	Row,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { EllipsisVertical, Filter, Search, Settings2, X } from 'lucide-react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardFooter,
	CardHeader,
	CardHeading,
	CardTable,
	CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
	DataGridTable,
	DataGridTableRowSelect,
	DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StatusChip } from '../../components/status-chip';

interface IAnimal {
	id: string;
	eid_tag: string;
	dob: string; // ISO
	gender: 'Male' | 'Female' | 'Unknown';
	status: 'Alive' | 'Sick' | 'Moved' | 'Deceased';
	lastEvent: string;
	unsynced?: boolean;
}

const sampleAnimals: IAnimal[] = [
	{
		id: '1',
		eid_tag: 'EID-1234',
		dob: '2022-02-10',
		gender: 'Female',
		status: 'Alive',
		lastEvent: 'Vaccination (2025-08-01)',
		unsynced: false,
	},
	{
		id: '2',
		eid_tag: 'EID-5678',
		dob: '2021-05-20',
		gender: 'Male',
		status: 'Sick',
		lastEvent: 'Illness noted (2025-08-10)',
		unsynced: true,
	},
	{
		id: '3',
		eid_tag: 'EID-9012',
		dob: '2018-11-03',
		gender: 'Female',
		status: 'Moved',
		lastEvent: 'Transfer to North Pasture (2025-07-28)',
		unsynced: false,
	},
];

function formatAge(dobIso: string): string {
	const dob = new Date(dobIso);
	if (isNaN(dob.getTime())) return '—';
	const now = new Date();
	let years = now.getFullYear() - dob.getFullYear();
	let months = now.getMonth() - dob.getMonth();
	if (months < 0) {
		years -= 1;
		months += 12;
	}
	if (years <= 0) return `${months} mo`;
	return months > 0 ? `${years}y ${months}m` : `${years}y`;
}

function ActionsCell({ row }: { row: Row<IAnimal> }) {
	const { copyToClipboard } = useCopyToClipboard();
	const handleCopyEID = () => {
		copyToClipboard(String(row.original.eid_tag));
		const message = `EID successfully copied: ${row.original.eid_tag}`;
		toast.custom(
			(t) => (
				<Alert variant="mono" icon="success" close={false} onClose={() => toast.dismiss(t)}>
					<AlertIcon>
						<RiCheckboxCircleFill />
					</AlertIcon>
					<AlertTitle>{message}</AlertTitle>
				</Alert>
			),
			{ position: 'top-center' },
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="size-7" mode="icon" variant="ghost">
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="end">
				<DropdownMenuItem asChild>
					<Link href={`/livestock/profiles/${row.original.eid_tag}`}>View Profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleCopyEID}>Copy EID</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Add Event</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const HerdList = () => {
	const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
	const [sorting, setSorting] = useState<SortingState>([{ id: 'eid_tag', desc: false }]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedGender, setSelectedGender] = useState<string[]>([]);
	const [selectedHealth, setSelectedHealth] = useState<string[]>([]);
	const [selectedMovement, setSelectedMovement] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<string>('EID');

	const filteredData = useMemo(() => {
		let filtered = sampleAnimals;
		if (selectedGender.length > 0) filtered = filtered.filter((a) => selectedGender.includes(a.gender));
		if (selectedHealth.length > 0) filtered = filtered.filter((a) => selectedHealth.includes(a.status));
		if (selectedMovement.length > 0)
			filtered = filtered.filter((a) =>
				selectedMovement.includes(a.status === 'Moved' ? 'Moved' : 'Stationary'),
			);
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter((a) => a.eid_tag.toLowerCase().includes(q));
		}
		if (sortBy === 'EID') filtered = [...filtered].sort((a, b) => a.eid_tag.localeCompare(b.eid_tag));
		if (sortBy === 'Status') filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status));
		// Last Event sort could parse dates from string in real impl
		return filtered;
	}, [searchQuery, selectedGender, selectedHealth, selectedMovement, sortBy]);

	const genderCounts = useMemo(() => {
		return sampleAnimals.reduce((acc, a) => {
			acc[a.gender] = (acc[a.gender] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
	}, []);

	const healthCounts = useMemo(() => {
		return sampleAnimals.reduce((acc, a) => {
			acc[a.status] = (acc[a.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
	}, []);

	const movementCounts = useMemo(() => {
		return sampleAnimals.reduce((acc, a) => {
			const key = a.status === 'Moved' ? 'Moved' : 'Stationary';
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
	}, []);

	const columns = useMemo<ColumnDef<IAnimal>[]>(
		() => [
			{
				accessorKey: 'id',
				accessorFn: (row) => row.id,
				header: () => <DataGridTableRowSelectAll />,
				cell: ({ row }) => <DataGridTableRowSelect row={row} />,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				size: 51,
				meta: { cellClassName: '' },
			},
			{
				id: 'eid_tag',
				accessorFn: (row) => row.eid_tag,
				header: ({ column }) => <DataGridColumnHeader title="EID Tag" column={column} />,
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<span className="text-foreground font-medium">{row.original.eid_tag}</span>
						{row.original.unsynced && (
							<Badge size="sm" appearance="stroke">Unsynced</Badge>
						)}
					</div>
				),
				enableSorting: true,
				size: 160,
				meta: { headerClassName: '' },
			},
			{
				id: 'gender',
				accessorFn: (row) => row.gender,
				header: ({ column }) => <DataGridColumnHeader title="Gender" column={column} />,
				cell: ({ row }) => <span className="text-foreground font-normal">{row.original.gender}</span>,
				enableSorting: true,
				size: 120,
				meta: { headerClassName: '' },
			},
			{
				id: 'dob',
				accessorFn: (row) => row.dob,
				header: ({ column }) => <DataGridColumnHeader title="DOB / Age" column={column} />,
				cell: ({ row }) => (
					<span className="text-foreground font-normal">{new Date(row.original.dob).toLocaleDateString()} ({formatAge(row.original.dob)})</span>
				),
				enableSorting: true,
				size: 200,
				meta: { headerClassName: '' },
			},
			{
				id: 'status',
				accessorFn: (row) => row.status,
				header: ({ column }) => <DataGridColumnHeader title="Current Status" column={column} />,
				cell: ({ row }) => <StatusChip status={row.original.status} />,
				enableSorting: true,
				size: 160,
				meta: { headerClassName: '' },
			},
			{
				id: 'lastEvent',
				accessorFn: (row) => row.lastEvent,
				header: ({ column }) => <DataGridColumnHeader title="Last Event" column={column} />,
				cell: ({ row }) => <span className="text-foreground font-normal">{row.original.lastEvent}</span>,
				enableSorting: true,
				size: 260,
				meta: { headerClassName: '' },
			},
			{
				id: 'actions',
				header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
				enableSorting: false,
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<Button mode="link" underlined="dashed" size="sm" asChild>
							<Link href={`/livestock/profiles/${row.original.eid_tag}`}>View</Link>
						</Button>
						<Button mode="link" underlined="dashed" size="sm">Add Event</Button>
					</div>
				),
				size: 160,
			},
			{
				id: 'menu',
				header: '',
				cell: ({ row }) => <ActionsCell row={row} />,
				enableSorting: false,
				size: 60,
				meta: { headerClassName: '' },
			},
		],
		[],
	);

	const table = useReactTable({
		columns,
		data: filteredData,
		pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
		getRowId: (row: IAnimal) => String(row.id),
		state: { pagination, sorting, rowSelection },
		columnResizeMode: 'onChange',
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const Toolbar = () => {
		const { table } = useDataGrid();
		return (
			<CardToolbar>
				<DataGridColumnVisibility
					table={table}
					trigger={
						<Button variant="outline">
							<Settings2 />
							Columns
						</Button>
					}
				/>
			</CardToolbar>
		);
	};

	return (
		<DataGrid
			table={table}
			recordCount={filteredData?.length || 0}
			tableLayout={{ columnsPinnable: true, columnsMovable: true, columnsVisibility: true, cellBorder: true }}
		>
			<Card className="w-full max-w-full overflow-hidden">
				<CardHeader>
					<CardHeading>
						<div className="flex flex-wrap items-center gap-2.5 py-2">
							<div className="relative">
								<Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
								<Input placeholder="Search by EID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ps-9 w-40" />
								{searchQuery.length > 0 && (
									<Button mode="icon" variant="ghost" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery('')}>
										<X />
									</Button>
								)}
							</div>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<Filter /> Gender
										{selectedGender.length > 0 && <Badge size="sm" appearance="stroke">{selectedGender.length}</Badge>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-44 p-3" align="start">
									<div className="space-y-3">
										<div className="text-xs font-medium text-muted-foreground">Gender</div>
										{Object.keys(genderCounts).map((g) => (
											<div key={g} className="flex items-center gap-2.5">
												<Checkbox id={`gender-${g}`} checked={selectedGender.includes(g)} onCheckedChange={(c) => setSelectedGender((prev=[]) => c===true ? [...prev, g] : prev.filter((v) => v!==g))} />
												<Label htmlFor={`gender-${g}`} className="grow flex items-center justify-between font-normal gap-1.5">
													{g}
													<span className="text-muted-foreground">{genderCounts[g]}</span>
												</Label>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<Filter /> Health
										{selectedHealth.length > 0 && <Badge size="sm" appearance="stroke">{selectedHealth.length}</Badge>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-48 p-3" align="start">
									<div className="space-y-3">
										<div className="text-xs font-medium text-muted-foreground">Health Status</div>
										{Object.keys(healthCounts).map((s) => (
											<div key={s} className="flex items-center gap-2.5">
												<Checkbox id={`health-${s}`} checked={selectedHealth.includes(s)} onCheckedChange={(c) => setSelectedHealth((prev=[]) => c===true ? [...prev, s] : prev.filter((v) => v!==s))} />
												<Label htmlFor={`health-${s}`} className="grow flex items-center justify-between font-normal gap-1.5">
													{s}
													<span className="text-muted-foreground">{healthCounts[s]}</span>
												</Label>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<Filter /> Movement
										{selectedMovement.length > 0 && <Badge size="sm" appearance="stroke">{selectedMovement.length}</Badge>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-48 p-3" align="start">
									<div className="space-y-3">
										<div className="text-xs font-medium text-muted-foreground">Movement</div>
										{['Stationary', 'Moved'].map((s) => (
											<div key={s} className="flex items-center gap-2.5">
												<Checkbox id={`move-${s}`} checked={selectedMovement.includes(s)} onCheckedChange={(c) => setSelectedMovement((prev=[]) => c===true ? [...prev, s] : prev.filter((v) => v!==s))} />
												<Label htmlFor={`move-${s}`} className="grow flex items-center justify-between font-normal gap-1.5">
													{s}
													<span className="text-muted-foreground">{movementCounts[s] || 0}</span>
												</Label>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<Filter /> Sort
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-44 p-3" align="start">
									<div className="space-y-3">
										<div className="text-xs font-medium text-muted-foreground">Sort By</div>
										{['EID', 'Last Event', 'Status'].map((s) => (
											<div key={s} className="flex items-center gap-2.5">
												<Checkbox id={`sort-${s}`} checked={sortBy === s} onCheckedChange={(c) => c && setSortBy(s)} />
												<Label htmlFor={`sort-${s}`} className="grow flex items-center justify-between font-normal gap-1.5">{s}</Label>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</CardHeading>
					<Toolbar />
				</CardHeader>
				<CardTable>
					<ScrollArea>
						<DataGridTable />
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</CardTable>
				<CardFooter>
					<DataGridPagination />
				</CardFooter>
			</Card>
		</DataGrid>
	);
};

export { HerdList };