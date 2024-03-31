/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Router,
  NavigationEnd,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService, Role } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesService } from 'app/admin/employees/allEmployees/employees.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    RouterLinkActive,
    RouterLink,
    NgClass,
    FeatherModule,
    TranslateModule,
  ],
})
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private cookieS : CookieService,
    private employeS : EmployeesService
  ) {
    super();
    this.elementRef.nativeElement.closest('body');
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }
  userData: any; // Variable pour stocker les données utilisateur

  ngOnInit() {
    const cookieData = this.cookieS.get('user_data'); // Obtenez le contenu du cookie
  
    if (cookieData) {
      try {
        const userData = JSON.parse(cookieData); // Décoder le contenu du cookie     
        const userRole = userData.user.role;
        const firstName = userData?.user?.firstname || '';
        const lastName =  userData?.user?.lastname || '';
        console.log(lastName);
        this.userFullName = `${firstName} ${lastName}`;
        this.userImg =userData?.user.profileImage;
        if (userRole.includes('Admin')) {
          this.sidebarItems = ROUTES.filter((item) => item.role.includes('Admin'));
          this.userType = 'Admin';
        } else if (userRole.includes('Client')) {
          this.sidebarItems = ROUTES.filter((item) => item.role.includes('Client'));
          this.userType = 'Client';
        } else if (userRole.includes('Employe')) {
          this.sidebarItems = ROUTES.filter((item) => item.role.includes('Employee'));
          this.userType = 'Employe';
        } else {
          this.sidebarItems = [];
          this.userType = 'Unknown';
        }
      } catch (error) {
        console.error('Erreur lors du décodage du cookie:', error);
        // Gérez les erreurs de décodage du cookie
      }
    } else {
      console.error('Le cookie "user_data" n\'est pas défini');
      // Gérez le cas où le cookie n'est pas défini
    }
  
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  logout() {
this.authService.logout();}
imageUrl!: string;


}
