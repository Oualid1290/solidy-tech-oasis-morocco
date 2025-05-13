
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, Shield, AlertTriangle, CheckCircle, XCircle, 
  ChevronRight, UserCheck, Activity 
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function AdminDashboard() {
  const { userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  
  // Mock data for development
  const mockUsers = [
    {
      id: 'user1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'buyer',
      is_verified: true,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      last_seen: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'user2',
      username: 'tech_seller',
      email: 'tech@example.com',
      role: 'seller',
      is_verified: true,
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      last_seen: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'user3',
      username: 'new_user42',
      email: 'new@example.com',
      role: 'buyer',
      is_verified: false,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      last_seen: new Date().toISOString(),
    },
  ];
  
  const mockReports = [
    {
      id: 'report1',
      type: 'listing',
      target_id: 'listing1',
      target_name: 'Fake Product Listing',
      reporter_id: 'user1',
      reporter_username: 'john_doe',
      reason: 'Counterfeit product',
      status: 'pending',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'report2',
      type: 'user',
      target_id: 'user5',
      target_name: 'scammer123',
      reporter_id: 'user2',
      reporter_username: 'tech_seller',
      reason: 'Fraudulent behavior',
      status: 'under_review',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'report3',
      type: 'message',
      target_id: 'message1',
      target_name: 'Inappropriate message',
      reporter_id: 'user3',
      reporter_username: 'new_user42',
      reason: 'Offensive content',
      status: 'resolved',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  // This would be replaced with real data fetching
  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'under_review':
        return 'default';
      case 'resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor platform activity and manage users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {mockUsers.length}
              </div>
              <div className="text-xs text-muted-foreground">
                <Users className="inline h-4 w-4 mr-1" />
                Accounts
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {mockUsers.filter(user => {
                  const lastSeen = new Date(user.last_seen);
                  const daysSinceLastSeen = (Date.now() - lastSeen.getTime()) / (1000 * 3600 * 24);
                  return daysSinceLastSeen < 7;
                }).length}
              </div>
              <div className="text-xs text-muted-foreground">
                <UserCheck className="inline h-4 w-4 mr-1" />
                Last 7 days
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {mockReports.filter(report => report.status === 'pending').length}
              </div>
              <div className="text-xs text-muted-foreground">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Require attention
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'admin' 
                            ? "destructive" 
                            : user.role === 'seller' 
                              ? "default" 
                              : "secondary"
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.is_verified ? (
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <XCircle className="h-4 w-4 text-amber-500 mr-1" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_seen)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/profile/${user.username}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Manage reports from users about content or behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </TableCell>
                      <TableCell>{report.target_name}</TableCell>
                      <TableCell>{report.reporter_username}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{formatDate(report.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(report.status)}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>
                Recent activity across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute h-full w-px bg-muted left-4 top-0"></div>
                <ol className="space-y-6 ml-9">
                  <li className="relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-muted flex items-center justify-center z-10">
                      <Users className="h-3 w-3" />
                    </div>
                    <div>
                      <time className="text-xs text-muted-foreground">
                        Today, 10:32 AM
                      </time>
                      <h3 className="font-medium">New user registration</h3>
                      <p className="text-sm text-muted-foreground">
                        User <span className="font-medium">new_user42</span> created an account
                      </p>
                    </div>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-muted flex items-center justify-center z-10">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div>
                      <time className="text-xs text-muted-foreground">
                        Yesterday, 3:14 PM
                      </time>
                      <h3 className="font-medium">New report submitted</h3>
                      <p className="text-sm text-muted-foreground">
                        User <span className="font-medium">tech_seller</span> reported an account for fraudulent behavior
                      </p>
                    </div>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-muted flex items-center justify-center z-10">
                      <Shield className="h-3 w-3" />
                    </div>
                    <div>
                      <time className="text-xs text-muted-foreground">
                        May 10, 2:22 PM
                      </time>
                      <h3 className="font-medium">Admin action</h3>
                      <p className="text-sm text-muted-foreground">
                        Admin <span className="font-medium">{userProfile?.username}</span> resolved a report
                      </p>
                    </div>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-muted flex items-center justify-center z-10">
                      <Activity className="h-3 w-3" />
                    </div>
                    <div>
                      <time className="text-xs text-muted-foreground">
                        May 9, 9:45 AM
                      </time>
                      <h3 className="font-medium">System notification</h3>
                      <p className="text-sm text-muted-foreground">
                        Database backup completed successfully
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
