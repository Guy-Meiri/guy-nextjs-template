import { UserProfileForm } from '@/components/profile/user-profile-form'

export default function ProfilePage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        
        <UserProfileForm />
      </div>
    </div>
  )
}
