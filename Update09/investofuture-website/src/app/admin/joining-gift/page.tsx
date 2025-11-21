## Admin - Joining Gift

You can copy the complete code for the "Joining Gift" page from the block below.

**File Path:** `src/app/admin/joining-gift/page.tsx`

```tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, LoaderCircle, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import initialUserData from '@/lib/data/user-data.json';
import initialGiftData from '@/lib/data/joining-gift.json';


// Mock UserProfile type
type UserProfile = typeof initialUserData[0];

type GiftItem = {
    id: number;
    name: string;
    status: "Received" | "Pending";
    dateReceived: string | null;
}

type JoiningGift = {
    joiningDate: string;
    overallStatus: "Received" | "Pending" | "Partial";
    description: string;
    items: GiftItem[];
}

const defaultGiftData: JoiningGift = {
    joiningDate: new Date().toISOString(),
    overallStatus: "Pending",
    description: "",
    items: [],
};


function GiftEditorInternal() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [giftData, setGiftData] = useState<JoiningGift>(defaultGiftData);
    const [loadingData, setLoadingData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const getStorageKey = (userId: string) => `joining-gift_${userId}`;

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            const fetchUserAndData = async () => {
                setIsSearching(true);
                const user = initialUserData.find(u => u.id.toUpperCase() === userId.toUpperCase());
                if (user) {
                    setFoundUser(user);
                    setSearchTerm(user.id);
                    loadGiftData(user.id);
                } else {
                    toast({ title: "User not found with provided ID.", variant: "destructive" });
                }
                setIsSearching(false);
            };
            fetchUserAndData();
        }
    }, [searchParams, toast]);

    const loadGiftData = (userId: string) => {
        setLoadingData(true);
        try {
            const storedData = localStorage.getItem(getStorageKey(userId));
            if (storedData) {
                setGiftData(JSON.parse(storedData));
            } else {
                setGiftData(initialGiftData);
            }
        } catch (error) {
            console.error("Failed to load gift data from localStorage", error);
            setGiftData(initialGiftData);
        }
        setLoadingData(false);
    };

    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
        const user = initialUserData.find(u => u.id.toUpperCase() === searchTerm.trim().toUpperCase());

        if (!user) {
            toast({ title: "User Not Found", variant: "destructive" });
            setFoundUser(null);
        } else {
            router.push(`/admin/joining-gift?userId=${user.id}`);
        }
    };
    
    const handleItemChange = (id: number, field: string, value: any) => {
        setGiftData((prevData) => ({
        ...prevData,
        items: prevData.items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        ),
        }));
    };

    const handleAddItem = () => {
        setGiftData((prevData) => ({
        ...prevData,
        items: [
            ...prevData.items,
            {
            id: Date.now(),
            name: "",
            status: "Pending",
            dateReceived: null,
            },
        ],
        }));
    };

    const handleRemoveItem = (id: number) => {
        setGiftData((prevData) => ({
        ...prevData,
        items: prevData.items.filter((item) => item.id !== id),
        }));
    };

    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        
        setIsSaving(true);
        try {
            localStorage.setItem(getStorageKey(foundUser.id), JSON.stringify(giftData));
            toast({
                title: "Changes Saved",
                description: `Joining gift data for ${foundUser.personalInfo.fullName} has been saved permanently in this browser.`,
            });
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
            toast({
                title: "Error Saving Data",
                description: "Could not save changes. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle>Joining Gift Details</CardTitle>
            <CardDescription>
                Search for a user to manage their joining gift information.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Input 
                        placeholder="Search by User Reg. ID (e.g. INF001)" 
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                    />
                    <Button onClick={handleSearchUser} disabled={isSearching}>
                        {isSearching ? <LoaderCircle className="mr-2 h-4 animate-spin"/> : <Search className="mr-2 h-4"/>}
                        Search User
                    </Button>
                </div>

                 {(isSearching || loadingData) && (
                    <div className="flex items-center gap-2 justify-center py-8">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                        <p className="text-muted-foreground">{isSearching ? 'Searching for user...' : 'Loading gift data...'}</p>
                    </div>
                )}
                
                {foundUser && !loadingData && (
                 <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Editing joining gift for: <span className="text-primary">{foundUser.personalInfo.fullName}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Joining Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !giftData.joiningDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {giftData.joiningDate ? format(parseISO(giftData.joiningDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={parseISO(giftData.joiningDate)}
                                    onSelect={(date) => date && setGiftData(prev => ({...prev, joiningDate: date.toISOString()}))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overallStatus">Overall Status</Label>
                            <Select value={giftData.overallStatus} onValueChange={(value) => setGiftData(prev => ({...prev, overallStatus: value as any}))}>
                                <SelectTrigger id="overallStatus">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Received">Received</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={giftData.description} onChange={(e) => setGiftData(prev => ({...prev, description: e.target.value}))}/>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-secondary font-headline">Joining Gift Items</h3>
                        <p className="text-sm text-muted-foreground">
                            Add or remove items given as part of the joining gift.
                        </p>
                        <div className="space-y-4 rounded-lg border p-4">
                            {giftData.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="space-y-2">
                                    <Label htmlFor={`itemName-${item.id}`}>Item Name</Label>
                                    <Input
                                        id={`itemName-${item.id}`}
                                        value={item.name}
                                        onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`itemStatus-${item.id}`}>Status</Label>
                                    <Select
                                        value={item.status}
                                        onValueChange={(value) => handleItemChange(item.id, "status", value)}
                                    >
                                        <SelectTrigger id={`itemStatus-${item.id}`}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Received">Received</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date Received</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !item.dateReceived && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {item.dateReceived ? format(parseISO(item.dateReceived), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={item.dateReceived ? parseISO(item.dateReceived) : null}
                                            onSelect={(date) => handleItemChange(item.id, "dateReceived", date ? date.toISOString() : null)}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="w-full md:w-auto"
                                        >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            ))}
                            <Button variant="outline" onClick={handleAddItem} className="mt-4">
                                Add Item
                            </Button>
                        </div>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <LoaderCircle className="mr-2 h-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            )}
            </CardContent>
        </Card>
    );
}

function GiftEditor() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GiftEditorInternal />
        </Suspense>
    )
}

export default function JoiningGiftPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Joining Gift</h2>
         <Link href="/admin/manage-users">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                All Members List
            </Button>
        </Link>
      </div>
      <GiftEditor />
    </div>
  );
}
```

    