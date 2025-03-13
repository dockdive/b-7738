
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Star,
  TrendingUp,
  Edit,
  BarChart3,
  ListFilter,
  MessageSquare,
  Settings
} from "lucide-react";

// Mock data for the dashboard
const viewsData = [
  { name: 'Jan', views: 400 },
  { name: 'Feb', views: 300 },
  { name: 'Mar', views: 600 },
  { name: 'Apr', views: 800 },
  { name: 'May', views: 500 },
  { name: 'Jun', views: 900 },
  { name: 'Jul', views: 1100 },
];

const reviewsPerMonthData = [
  { name: 'Jan', reviews: 2 },
  { name: 'Feb', reviews: 3 },
  { name: 'Mar', reviews: 1 },
  { name: 'Apr', reviews: 4 },
  { name: 'May', reviews: 2 },
  { name: 'Jun', reviews: 5 },
  { name: 'Jul', reviews: 3 },
];

const ratingDistributionData = [
  { name: '5 stars', value: 65 },
  { name: '4 stars', value: 20 },
  { name: '3 stars', value: 10 },
  { name: '2 stars', value: 3 },
  { name: '1 star', value: 2 },
];

const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock business data
  const business = {
    id: "1",
    name: "Maritime Solutions Ltd",
    logo_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    totalViews: 4100,
    totalReviews: 20,
    averageRating: 4.5,
    status: "approved"
  };

  // Recent reviews mock data
  const recentReviews = [
    {
      id: '1',
      user_name: 'John Doe',
      rating: 5,
      comment: 'Excellent service, highly recommended!',
      created_at: '2023-07-15T10:30:00Z',
      reply: null
    },
    {
      id: '2',
      user_name: 'Jane Smith',
      rating: 4,
      comment: 'Very professional team, good communication.',
      created_at: '2023-07-10T14:20:00Z',
      reply: 'Thank you for your feedback! We appreciate your business.'
    },
    {
      id: '3',
      user_name: 'Robert Johnson',
      rating: 3,
      comment: 'Good service overall, but took longer than expected.',
      created_at: '2023-07-05T09:15:00Z',
      reply: null
    }
  ];

  const handleReplyToReview = (reviewId: string) => {
    toast({
      title: t("dashboard.replySubmitted"),
      description: t("dashboard.replySubmittedMessage"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-gray-600">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/add-business">
            <Button variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              {t("dashboard.addNewBusiness")}
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t("dashboard.accountSettings")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("dashboard.totalViews")}</p>
                <h3 className="text-2xl font-bold mt-1">{business.totalViews}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("dashboard.totalReviews")}</p>
                <h3 className="text-2xl font-bold mt-1">{business.totalReviews}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8% {t("dashboard.fromLastMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("dashboard.averageRating")}</p>
                <h3 className="text-2xl font-bold mt-1">{business.averageRating}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex mt-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(business.averageRating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("dashboard.listingStatus")}</p>
                <h3 className="text-2xl font-bold mt-1 capitalize">{t(`dashboard.status.${business.status}`)}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Link to={`/businesses/${business.id}`} className="text-sm text-primary mt-4 flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              {t("dashboard.viewListing")}
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t("dashboard.overview")}
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("dashboard.reviews")}
          </TabsTrigger>
          <TabsTrigger value="listings">
            <ListFilter className="mr-2 h-4 w-4" />
            {t("dashboard.myListings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.profileViews")}</CardTitle>
                <CardDescription>{t("dashboard.last7Months")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={viewsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.reviewsPerMonth")}</CardTitle>
                <CardDescription>{t("dashboard.last7Months")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reviewsPerMonthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reviews" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.ratingDistribution")}</CardTitle>
              <CardDescription>{t("dashboard.ratingDistributionDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.recentReviews")}</CardTitle>
              <CardDescription>
                {t("dashboard.recentReviewsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{review.user_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    
                    {review.reply ? (
                      <div className="mt-4 ml-6 bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <p className="text-sm font-semibold">{t("dashboard.yourResponse")}</p>
                        </div>
                        <p className="text-gray-700 text-sm">{review.reply}</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleReplyToReview(review.id)}>
                          {t("dashboard.replyToReview")}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.myListings")}</CardTitle>
              <CardDescription>
                {t("dashboard.myListingsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={business.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <Building2 className="h-8 w-8 m-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{business.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <div className="flex items-center mr-4">
                        <Users className="h-4 w-4 mr-1" />
                        {business.totalViews} {t("dashboard.views")}
                      </div>
                      <div className="flex items-center mr-4">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {business.totalReviews} {t("dashboard.reviews")}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {business.averageRating}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Link to={`/businesses/${business.id}`}>
                      <Button variant="outline" size="sm">
                        {t("dashboard.view")}
                      </Button>
                    </Link>
                    <Link to={`/businesses/${business.id}/edit`}>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Link to="/add-business">
                    <Button>
                      <Building2 className="mr-2 h-4 w-4" />
                      {t("dashboard.addNewBusiness")}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
