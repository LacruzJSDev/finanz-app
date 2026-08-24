import { Routes } from "@angular/router";
import { authGuard } from "../../core/auth/auth.guard";

export const GROUP_ACCOUNTS_ROUTES: Routes =[
    {path: "", loadComponent:() => import("./pages/account-groups/account-groups").then((m)=> m.AccountGroups), canActivate:[authGuard]},
    {path: ":id", loadComponent:() => import("./pages/account-group-detail/account-group-detail").then((m)=> m.AccountGroupDetail), canActivate:[authGuard]}
]
